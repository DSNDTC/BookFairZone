import api from '../lib/api';

// Match backend DTOs
export interface RegisterRequest {
  email: string;
  password: string;
  role: 'PUBLISHER' | 'USER' | 'ADMIN' | 'USER_ROLE' | 'ADMIN_ROLE'; // Backend uses these enum values
  name: string;
  businessName?: string;
  phoneNumber: string;
}

export interface RegisterResponse {
  userId: string;
  email: string;
  role: string;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  mfaRequired: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

class AuthService {
  // Register a new user
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await api.post<RegisterResponse>('/auth/register', userData);

      // Store user info (not storing token here as email verification is required)
      if (response.data.userId) {
        localStorage.setItem('pendingUser', JSON.stringify({
          userId: response.data.userId,
          email: response.data.email,
          role: response.data.role
        }));
      }

      return response.data;
    } catch (error: any) {
      console.error('Registration failed:', error);
      const errorMessage = error.response?.data?.message || error.response?.data || 'Registration failed';
      throw new Error(errorMessage);
    }
  }

  // Verify email
  async verifyEmail(token: string): Promise<string> {
    try {
      const response = await api.get<string>(`/auth/verify-email?token=${token}`);
      return response.data;
    } catch (error: any) {
      console.error('Email verification failed:', error);
      throw new Error(error.response?.data?.message || error.response?.data || 'Email verification failed');
    }
  }

  // Login user
  async login(loginData: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', loginData);

      if (response.data.accessToken && !response.data.mfaRequired) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        // Decode JWT to get user info (basic parsing)
        const tokenPayload = this.parseJwt(response.data.accessToken);
        if (tokenPayload) {
          localStorage.setItem('user', JSON.stringify({
            userId: tokenPayload.userId,
            email: tokenPayload.sub,
            role: tokenPayload.role
          }));
        }

        // Clear pending user if exists
        localStorage.removeItem('pendingUser');
      }

      return response.data;
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || error.response?.data || 'Login failed';
      throw new Error(errorMessage);
    }
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/refresh', {
        refreshToken
      });

      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        // Update user info from new token
        const tokenPayload = this.parseJwt(response.data.accessToken);
        if (tokenPayload) {
          localStorage.setItem('user', JSON.stringify({
            userId: tokenPayload.userId,
            email: tokenPayload.sub,
            role: tokenPayload.role
          }));
        }
      }

      return response.data;
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      this.logout();
      throw new Error(error.response?.data?.message || error.response?.data || 'Token refresh failed');
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // Backend expects token in Authorization header
        await api.post('/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
      // Continue with local cleanup even if API call fails
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('pendingUser');
    }
  }

  // Forgot password
  async forgotPassword(request: ForgotPasswordRequest): Promise<string> {
    try {
      const response = await api.post<string>('/auth/forgot-password', request);
      return response.data;
    } catch (error: any) {
      console.error('Forgot password failed:', error);
      throw new Error(error.response?.data?.message || error.response?.data || 'Failed to send reset email');
    }
  }

  // Reset password
  async resetPassword(request: ResetPasswordRequest): Promise<string> {
    try {
      const response = await api.post<string>('/auth/reset-password', request);
      return response.data;
    } catch (error: any) {
      console.error('Password reset failed:', error);
      throw new Error(error.response?.data?.message || error.response?.data || 'Password reset failed');
    }
  }

  // Get current user from local storage
  getCurrentUser(): { userId: string; email: string; role: string } | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    // Check if token is expired
    try {
      const payload = this.parseJwt(token);
      if (!payload || !payload.exp) return false;

      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (e) {
      return false;
    }
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  // Parse JWT token (simple implementation)
  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error parsing JWT:', e);
      return null;
    }
  }

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
}

export default new AuthService();