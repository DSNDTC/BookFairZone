import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      toast.success("Login successful!");
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-parchment to-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-burgundy rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 animate-fade-in">
          <BookOpen className="w-32 h-32 text-burgundy mb-8 animate-float" />
          <h1 className="font-serif text-5xl font-bold text-foreground text-center mb-4">
            Colombo International
            <span className="block text-burgundy mt-2">Bookfair</span>
          </h1>
          <p className="text-center text-muted-foreground text-lg max-w-md">
            Reserve your stall at Sri Lanka's premier literary exhibition
          </p>
          <div className="mt-8 flex items-center gap-2 text-sm text-brown">
            <div className="w-16 h-px bg-border" />
            <span className="font-serif italic">Est. by SLBPA</span>
            <div className="w-16 h-px bg-border" />
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full animate-fade-in-scale">
          <div className="bg-card shadow-[var(--shadow-elegant)] rounded-2xl p-8 md:p-12 border border-border">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-burgundy to-burgundy-light rounded-full mb-4">
                <BookOpen className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
                Welcome Back
              </h2>
              <p className="text-muted-foreground">Sign in to manage your stall reservations</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="publisher@bookfair.lk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-border focus:border-burgundy transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 border-border focus:border-burgundy transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-burgundy hover:text-burgundy-light transition-colors">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="elegant"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-burgundy hover:text-burgundy-light font-semibold transition-colors">
                  Create Account
                </Link>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border text-center">
              <Link to="/employee-login" className="text-sm text-brown hover:text-brown-light transition-colors">
                Employee Portal →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
