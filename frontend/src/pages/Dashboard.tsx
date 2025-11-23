import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { BookOpen, Calendar, MapPin, CreditCard, User, LogOut } from "lucide-react";
import authService from "@/services/auth.service";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Get current user info
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await authService.logout();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed, but you've been logged out locally");
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const stats = [
    { label: "Active Reservations", value: "2", icon: Calendar, color: "burgundy" },
    { label: "Available Stalls", value: "24", icon: MapPin, color: "gold" },
    { label: "Total Spent", value: "LKR 85,000", icon: CreditCard, color: "brown" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-parchment to-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40 backdrop-blur-sm bg-card/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-burgundy to-burgundy-light rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-foreground">Dashboard</h1>
                <p className="text-xs text-muted-foreground">
                  {user?.email || "Publisher Portal"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/reservations">
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  My Reservations
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
            Welcome back!
          </h2>
          <p className="text-muted-foreground">
            Manage your stall reservations for Colombo International Bookfair
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className="p-6 border-border shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-book)] transition-all duration-300 hover:-translate-y-1 animate-fade-in-scale"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-${stat.color}/10 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 border-border shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-book)] transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-burgundy/10 rounded-lg flex items-center justify-center group-hover:bg-burgundy/20 transition-colors">
                <MapPin className="w-6 h-6 text-burgundy" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Browse Available Stalls</h3>
            <p className="text-muted-foreground mb-4">
              View and reserve stalls for the upcoming bookfair
            </p>
            <Link to="/genres">
              <Button variant="elegant" className="w-full">
                View Stalls
              </Button>
            </Link>
          </Card>

          <Card className="p-6 border-border shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-book)] transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <Calendar className="w-6 h-6 text-gold" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">My Reservations</h3>
            <p className="text-muted-foreground mb-4">
              Manage your existing stall reservations
            </p>
            <Link to="/reservations">
              <Button variant="bronze" className="w-full">
                View Reservations
              </Button>
            </Link>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;