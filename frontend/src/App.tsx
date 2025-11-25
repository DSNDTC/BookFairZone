import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
// EmployeeLogin removed - using unified login with role-based routing
import EmployeePortal from "./pages/EmployeePortal";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import Genres from "./pages/Genres";
import Reservations from "./pages/Reservations";
import MyReservations from "./pages/MyReservations";
import StallManagement from "./pages/StallManagement";
import ReservationManagement from "./pages/ReservationManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import authService from "./services/auth.service";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Component to handle root redirect based on auth status
const RootRedirect = () => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  if (isAuthenticated && user) {
    // Redirect based on role
    if (user.role === 'ADMIN_ROLE' || user.role === 'ADMIN') {
      return <Navigate to="/employee-portal" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Publisher/User routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['PUBLISHER', 'USER', 'USER_ROLE']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/genres"
            element={
              <ProtectedRoute allowedRoles={['PUBLISHER', 'USER', 'USER_ROLE']}>
                <Genres />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <ProtectedRoute allowedRoles={['PUBLISHER', 'USER', 'USER_ROLE']}>
                <Reservations />
              </ProtectedRoute>
            }
          />
          <Route

            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['PUBLISHER', 'USER', 'USER_ROLE']}>
                <UserProfile />
              </ProtectedRoute>
            }/>
            path="/my-reservations"
            element={
              <ProtectedRoute allowedRoles={['PUBLISHER', 'USER', 'USER_ROLE']}>
                <MyReservations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stall-management"
            element={
              <ProtectedRoute allowedRoles={['PUBLISHER', 'USER', 'USER_ROLE', 'ADMIN_ROLE', 'ADMIN']}>
                <StallManagement />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin routes */}
          <Route
            path="/employee-portal"
            element={
              <ProtectedRoute allowedRoles={['ADMIN_ROLE', 'ADMIN']}>
                <EmployeePortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservation-management"
            element={
              <ProtectedRoute allowedRoles={['ADMIN_ROLE', 'ADMIN']}>
                <ReservationManagement />
              </ProtectedRoute>
            }
          />

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
