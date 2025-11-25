import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, ArrowLeft, Clock, Calendar, MapPin, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import authService from "@/services/auth.service";
import { reservationApi, ReservationResponse } from "@/lib/api";
import { toast } from "sonner";

const MyReservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setIsLoading(true);
      const data = await reservationApi.getMyReservations();
      setReservations(data);
    } catch (error: any) {
      console.error("Failed to load reservations:", error);
      toast.error(error.response?.data?.message || "Failed to load your reservations");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'REJECTED':
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'PENDING':
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-parchment to-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40 backdrop-blur-sm bg-card/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-burgundy to-burgundy/80 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="font-serif text-xl font-bold text-foreground">My Reservations</h1>
            </div>
            <Link to="/reservations">
              <Button variant="outline" size="sm">
                <MapPin className="w-4 h-4 mr-2" />
                New Reservation
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
            Your Reservations
          </h2>
          <p className="text-muted-foreground">
            View and track the status of your stall reservations
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <Card className="p-12 text-center">
            <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading your reservations...</p>
          </Card>
        ) : reservations.length === 0 ? (
          /* Empty State */
          <Card className="p-12 text-center border-border shadow-[var(--shadow-elegant)]">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Reservations Yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't made any stall reservations. Start by selecting a stall!
            </p>
            <Link to="/reservations">
              <Button className="bg-burgundy hover:bg-burgundy/90">
                <MapPin className="w-4 h-4 mr-2" />
                Browse Available Stalls
              </Button>
            </Link>
          </Card>
        ) : (
          /* Reservations Grid */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reservations.map((reservation, index) => (
              <Card
                key={reservation.id}
                className="p-6 border-border shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-book)] transition-all duration-300 hover:-translate-y-1 animate-fade-in-scale"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(reservation.status)}
                    <div>
                      <h3 className="font-semibold text-foreground">Reservation #{reservation.id}</h3>
                      <p className="text-sm text-muted-foreground">Stall #{reservation.stallId}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyle(reservation.status)}`}>
                    {reservation.status}
                  </span>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">Stall #{reservation.stallId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Created: {new Date(reservation.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {new Date(reservation.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                {reservation.status === 'PENDING' && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg">
                      ⏳ Your reservation is pending approval from the administrator.
                    </p>
                  </div>
                )}

                {reservation.status === 'CONFIRMED' && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                      ✅ Your reservation has been confirmed!
                    </p>
                  </div>
                )}

                {reservation.status === 'REJECTED' && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                      ❌ Your reservation was rejected. Please contact support for more information.
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {!isLoading && reservations.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center border-border">
              <p className="text-2xl font-bold text-foreground">{reservations.length}</p>
              <p className="text-sm text-muted-foreground">Total Reservations</p>
            </Card>
            <Card className="p-4 text-center border-border">
              <p className="text-2xl font-bold text-yellow-600">
                {reservations.filter(r => r.status === 'PENDING').length}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </Card>
            <Card className="p-4 text-center border-border">
              <p className="text-2xl font-bold text-green-600">
                {reservations.filter(r => r.status === 'CONFIRMED').length}
              </p>
              <p className="text-sm text-muted-foreground">Confirmed</p>
            </Card>
            <Card className="p-4 text-center border-border">
              <p className="text-2xl font-bold text-red-600">
                {reservations.filter(r => r.status === 'REJECTED' || r.status === 'CANCELLED').length}
              </p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyReservations;
