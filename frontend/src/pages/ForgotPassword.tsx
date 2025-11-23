import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import authService, { ForgotPasswordRequest } from "@/services/auth.service";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const request: ForgotPasswordRequest = { email };
      const message = await authService.forgotPassword(request);

      toast.success("Password reset email sent!");
      setEmailSent(true);
    } catch (error: any) {
      console.error("Forgot password error:", error);


      toast.success("If an account exists with this email, you will receive a password reset link.");
      setEmailSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-parchment to-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-burgundy rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md p-8 md:p-12 border-border shadow-[var(--shadow-elegant)] relative z-10 animate-fade-in-scale">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        {!emailSent ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-burgundy to-burgundy-light rounded-full mb-4">
                <Mail className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
                Forgot Password?
              </h2>
              <p className="text-muted-foreground">
                No worries! Enter your email and we'll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-border focus:border-burgundy transition-colors"
                    disabled={isLoading}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  We'll send a password reset link to this email address.
                </p>
              </div>

              <Button
                type="submit"
                variant="elegant"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-burgundy hover:text-burgundy-light font-semibold transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
                Check Your Email
              </h2>
              <p className="text-muted-foreground">
                We've sent a password reset link to
              </p>
              <p className="font-semibold text-foreground mt-2">{email}</p>
            </div>

            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800 text-sm">
                <ul className="list-disc list-inside space-y-1">
                  <li>Click the link in the email to reset your password</li>
                  <li>The link expires in 1 hour</li>
                  <li>Check your spam folder if you don't see it</li>
                </ul>
              </AlertDescription>
            </Alert>

            <Button
              variant="elegant"
              size="lg"
              className="w-full"
              onClick={handleBackToLogin}
            >
              Back to Login
            </Button>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email?{" "}
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail("");
                  }}
                  className="text-burgundy hover:text-burgundy-light font-semibold transition-colors"
                >
                  Try Again
                </button>
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;