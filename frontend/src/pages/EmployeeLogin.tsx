import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { BookOpen, Lock, User, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const EmployeeLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - in real app, this would be backend validation
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("employeeAuth", "true");
      toast.success("Login successful!");
      navigate("/employee-portal");
    } else {
      toast.error("Invalid credentials. Use admin/admin123");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-parchment to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 border-border shadow-[var(--shadow-elegant)] animate-fade-in-scale">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Main Login
        </Link>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-navy to-navy/80 rounded-lg flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            Employee Portal
          </h1>
          <p className="text-muted-foreground">
            SLBPA Administrator Login
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" variant="elegant" size="lg" className="w-full">
            Login to Portal
          </Button>
        </form>

        <div className="mt-6 p-4 bg-navy/5 border border-navy/10 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            Demo credentials: <strong>admin</strong> / <strong>admin123</strong>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default EmployeeLogin;
