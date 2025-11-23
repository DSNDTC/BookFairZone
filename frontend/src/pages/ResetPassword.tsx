import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import authService, { ResetPasswordRequest } from "@/services/auth.service";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    const resetToken = searchParams.get("token");

    if (!resetToken) {
      setTokenError(true);
      toast.error("Invalid or missing reset token");
    } else {
      setToken(resetToken);
    }
  }, [searchParams]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validatePassword = () => {
    if (formData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);

    try {
      const request: ResetPasswordRequest = {
        token: token,
        newPassword: formData.newPassword,
      };

      const message = await authService.resetPassword(request);

      toast.success("Password reset successful!");
      setResetSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login", {
          state: {
            message: "Password reset successful! Please login with your new password."
          }
        });
      }, 3000);
    } catch (error: any) {
      console.error("Reset password error:", error);

      const errorMessage = error.message || "Password reset failed";

      if (errorMessage.includes("expired")) {
        toast.error("Reset link has expired. Please request a new one.");
        setTokenError(true);
      } else if (errorMessage.includes("already used")) {
        toast.error("This reset link has already been used.");
        setTokenError(true);
      } else if (errorMessage.includes("Invalid")) {
        toast.error("Invalid reset token. Please request a new one.");
        setTokenError(true);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };


  if (tokenError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-parchment to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 md:p-12 border-border shadow-[var(--shadow-elegant)] animate-fade-in-scale">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
              Invalid Reset Link
            </h2>
            <p className="text-muted-foreground mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Link to="/forgot-password">
              <Button variant="elegant" size="lg" className="w-full">
                Request New Reset Link
              </Button>
            </Link>
            <div className="mt-4">
              <Link
                to="/login"
                className="text-sm text-burgundy hover:text-burgundy-light transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-parchment to-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-burgundy rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md p-8 md:p-12 border-border shadow-[var(--shadow-elegant)] relative z-10 animate-fade-in-scale">
        {!resetSuccess ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-burgundy to-burgundy-light rounded-full mb-4">
                <Lock className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
                Reset Password
              </h2>
              <p className="text-muted-foreground">
                Enter your new password below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={(e) => handleChange("newPassword", e.target.value)}
                    className="pl-10 h-12 border-border focus:border-burgundy transition-colors"
                    disabled={isLoading}
                    minLength={8}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    className="pl-10 h-12 border-border focus:border-burgundy transition-colors"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="text-blue-800 text-sm">
                  <strong>Password Requirements:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Minimum 8 characters</li>
                    <li>Both passwords must match</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                variant="elegant"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm text-burgundy hover:text-burgundy-light transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
                Password Reset!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your password has been successfully reset.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Redirecting to login page...
              </p>
              <Button
                variant="elegant"
                size="lg"
                className="w-full"
                onClick={() => navigate("/login")}
              >
                Go to Login
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ResetPassword;