import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { BookOpen, MapPin, Calendar, Package, LogOut, User, Settings } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Trigger book opening animation
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Mock booked stalls data
  const bookedStalls = [
    {
      id: 1,
      stallNumber: "A-12",
      size: "Medium",
      location: "Hall A, Section 2",
      price: 25000,
      bookingDate: "2024-01-15",
      status: "Confirmed",
      genres: ["Fiction", "Mystery"]
    },
    {
      id: 2,
      stallNumber: "B-08",
      size: "Large",
      location: "Hall B, Section 1",
      price: 40000,
      bookingDate: "2024-01-16",
      status: "Confirmed",
      genres: ["Children's Books", "Educational"]
    }
  ];

  const totalCost = bookedStalls.reduce((sum, stall) => sum + stall.price, 0);

  const stats = [
    { label: "Reserved Stalls", value: bookedStalls.length.toString(), max: "3", icon: MapPin, color: "navy" },
    { label: "Total Cost", value: `LKR ${totalCost.toLocaleString()}`, icon: Package, color: "bronze" },
    { label: "Event Date", value: "TBA", icon: Calendar, color: "slate" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-ivory to-background">
      {/* Animated book opening overlay */}
      {isAnimating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
          <div className="animate-book-open">
            <BookOpen className="w-32 h-32 text-navy" />
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40 backdrop-blur-sm bg-card/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-navy to-navy-light rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-foreground">Colombo Bookfair</h1>
                <p className="text-xs text-muted-foreground">Publisher Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h2 className="font-serif text-4xl font-bold text-foreground mb-2">
            Welcome Back! 📚
          </h2>
          <p className="text-muted-foreground text-lg">
            Manage your stall reservations for the Colombo International Bookfair
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className="p-6 border-border shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-book)] transition-all duration-300 hover:-translate-y-1 animate-fade-in-scale"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-${stat.color}/10 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
                {stat.max && (
                  <span className="text-xs text-muted-foreground">Max: {stat.max}</span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-8 border-border shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-book)] transition-all duration-300 bg-gradient-to-br from-card to-ivory/30 animate-fade-in">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-navy to-navy-light flex items-center justify-center flex-shrink-0">
                <MapPin className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                  Reserve Your Stall
                </h3>
                <p className="text-muted-foreground">
                  Browse available stalls on the venue map and secure your spot at the exhibition
                </p>
              </div>
            </div>
            <Link to="/reservations">
              <Button variant="elegant" size="lg" className="w-full">
                View Available Stalls →
              </Button>
            </Link>
          </Card>

          <Card className="p-8 border-border shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-book)] transition-all duration-300 bg-gradient-to-br from-card to-ivory/30 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-bronze to-bronze-light flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-8 h-8 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                  Literary Genres
                </h3>
                <p className="text-muted-foreground">
                  Add the genres and categories you'll be showcasing at your stall
                </p>
              </div>
            </div>
            <Link to="/genres">
              <Button variant="bronze" size="lg" className="w-full">
                Manage Genres →
              </Button>
            </Link>
          </Card>
        </div>

        {/* Booked Stalls Section */}
        {bookedStalls.length > 0 && (
          <div className="mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Your Booked Stalls</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {bookedStalls.map((stall, index) => (
                <Card
                  key={stall.id}
                  className="p-6 border-border shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-book)] transition-all duration-300 animate-fade-in-scale"
                  style={{ animationDelay: `${(index + 2) * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-navy/10 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-navy" />
                      </div>
                      <div>
                        <h4 className="font-serif text-xl font-bold text-foreground">
                          Stall {stall.stallNumber}
                        </h4>
                        <p className="text-sm text-muted-foreground">{stall.location}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-navy/10 text-navy">
                      {stall.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Size</span>
                      <span className="font-semibold text-foreground">{stall.size}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Price</span>
                      <span className="font-semibold text-foreground">
                        LKR {stall.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Booking Date</span>
                      <span className="font-semibold text-foreground">
                        {new Date(stall.bookingDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="pt-2">
                      <span className="text-sm text-muted-foreground">Genres</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {stall.genres.map((genre) => (
                          <span
                            key={genre}
                            className="px-2 py-1 rounded text-xs bg-bronze/10 text-bronze"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Info Banner */}
        <Card className="p-6 border-l-4 border-l-navy bg-card/50 backdrop-blur-sm animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-navy text-xl">ℹ️</span>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Reservation Guidelines</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Maximum 3 stalls can be reserved per business</li>
                <li>• Stalls are available in three sizes: Small, Medium, and Large</li>
                <li>• A unique QR code pass will be generated upon successful reservation</li>
                <li>• Check your email for reservation confirmation and venue details</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="font-serif mb-2">Colombo International Bookfair</p>
            <p>Organized by Sri Lanka Book Publishers' Association</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
