import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, ArrowLeft, CheckCircle, XCircle, Clock, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NotificationBell } from "@/components/NotificationBell";
import authService from "@/services/auth.service";
import { reservationApi, ReservationResponse } from "@/lib/api";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const ReservationManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
      setIsLoadingReservations(true);
      const data = await reservationApi.getAllReservations();
      setReservations(data);
    } catch (error: any) {
      console.error("Failed to load reservations:", error);
      toast.error("Failed to load reservations");
    } finally {
      setIsLoadingReservations(false);
    }
  };

  const handleConfirmReservation = async (reservationId: number) => {
    try {
      await reservationApi.confirmReservation(reservationId);
      toast.success("Reservation confirmed successfully");
      loadReservations();
    } catch (error: any) {
      console.error("Failed to confirm reservation:", error);
      toast.error(error.response?.data?.message || "Failed to confirm reservation");
    }
  };

  const handleRejectReservation = async (reservationId: number) => {
    try {
      await reservationApi.rejectReservation(reservationId);
      toast.success("Reservation rejected successfully");
      loadReservations();
    } catch (error: any) {
      console.error("Failed to reject reservation:", error);
      toast.error(error.response?.data?.message || "Failed to reject reservation");
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const filteredReservations = reservations.filter((res) => {
    const matchesSearch =
      res.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.id.toString().includes(searchQuery);
    const matchesFilter = filterStatus === "all" || res.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-parchment to-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40 backdrop-blur-sm bg-card/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/employee-portal" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Portal</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-burgundy to-burgundy/80 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="font-serif text-xl font-bold text-foreground">Reservation Management</h1>
            </div>
            <NotificationBell 
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onClearAll={handleClearAll}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
            Manage Reservations
          </h2>
          <p className="text-muted-foreground">
            Review and manage all stall reservations
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 border-border shadow-[var(--shadow-elegant)] mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by user email or reservation ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Reservations Table */}
        {isLoadingReservations ? (
          <Card className="p-12 text-center">
            <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading reservations...</p>
          </Card>
        ) : (
          <>
            <Card className="border-border shadow-[var(--shadow-elegant)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-parchment/50 border-b border-border">
                    <tr>
                      <th className="text-left p-4 font-semibold text-sm text-foreground">ID</th>
                      <th className="text-left p-4 font-semibold text-sm text-foreground">User</th>
                      <th className="text-left p-4 font-semibold text-sm text-foreground">Stall ID</th>
                      <th className="text-left p-4 font-semibold text-sm text-foreground">Status</th>
                      <th className="text-left p-4 font-semibold text-sm text-foreground">Created At</th>
                      <th className="text-left p-4 font-semibold text-sm text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.map((reservation) => (
                      <tr
                        key={reservation.id}
                        className="border-b border-border hover:bg-parchment/30 transition-colors"
                      >
                        <td className="p-4 text-sm font-medium text-foreground">#{reservation.id}</td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-foreground">{reservation.userEmail}</p>
                            <p className="text-xs text-muted-foreground">ID: {reservation.userId}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-burgundy/10 text-burgundy text-xs font-medium rounded">
                            Stall #{reservation.stallId}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                            reservation.status === 'CONFIRMED' ? 'bg-green-100 text-green-800 border-green-200' :
                            reservation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          }`}>
                            {reservation.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {new Date(reservation.createdAt).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {reservation.status === 'PENDING' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => handleConfirmReservation(reservation.id)}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleRejectReservation(reservation.id)}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {reservation.status !== 'PENDING' && (
                              <span className="text-xs text-muted-foreground italic">No actions available</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {filteredReservations.length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No reservations found</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ReservationManagement;
