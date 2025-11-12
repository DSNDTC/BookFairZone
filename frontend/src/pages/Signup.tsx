import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Mail, Lock, Building2, Phone, User } from "lucide-react";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    // Simulate signup
    setTimeout(() => {
      toast.success("Registration successful!");
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
            Join the
            <span className="block text-burgundy mt-2">Literary Festival</span>
          </h1>
          <p className="text-center text-muted-foreground text-lg max-w-md mb-8">
            Showcase your publications at Sri Lanka's most prestigious book exhibition
          </p>
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-burgundy/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-burgundy font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Premium Stalls</h3>
                <p className="text-sm text-muted-foreground">Choose from small, medium, or large stalls</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-burgundy/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-burgundy font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">QR Access Pass</h3>
                <p className="text-sm text-muted-foreground">Instant digital pass generation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-burgundy/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-burgundy font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Easy Management</h3>
                <p className="text-sm text-muted-foreground">Reserve up to 3 stalls per business</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Signup form */}
        <div className="w-full animate-fade-in-scale">
          <div className="bg-card shadow-[var(--shadow-elegant)] rounded-2xl p-8 md:p-12 border border-border max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold to-gold-dark rounded-full mb-4">
                <BookOpen className="w-8 h-8 text-accent-foreground" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
                Create Account
              </h2>
              <p className="text-muted-foreground">Register your business for stall reservation</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-sm font-medium">
                  Business Name
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="businessName"
                    placeholder="ABC Publishers Pvt Ltd"
                    value={formData.businessName}
                    onChange={(e) => handleChange("businessName", e.target.value)}
                    className="pl-10 h-12 border-border focus:border-gold transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson" className="text-sm font-medium">
                  Contact Person
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="contactPerson"
                    placeholder="John Perera"
                    value={formData.contactPerson}
                    onChange={(e) => handleChange("contactPerson", e.target.value)}
                    className="pl-10 h-12 border-border focus:border-gold transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@abc.lk"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="pl-10 h-12 border-border focus:border-gold transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+94 77 123 4567"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="pl-10 h-12 border-border focus:border-gold transition-colors"
                      required
                    />
                  </div>
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
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className="pl-10 h-12 border-border focus:border-gold transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    className="pl-10 h-12 border-border focus:border-gold transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 rounded border-border" required />
                <Label className="text-xs text-muted-foreground font-normal leading-relaxed">
                  I agree to the Terms & Conditions and Privacy Policy of the Colombo International Bookfair
                </Label>
              </div>

              <Button
                type="submit"
                variant="bronze"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-burgundy hover:text-burgundy-light font-semibold transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
