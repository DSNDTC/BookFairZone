import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Users, MapPin, TrendingUp, Filter, Settings, LogOut, ClipboardList } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { NotificationBell } from "@/components/NotificationBell";

import authService from "@/services/auth.service";
import { toast } from "sonner";

interface Reservation {
  id: string;
  businessName: string;
  contactPerson: string;
  email: string;
  stalls: string[];
  totalCost: number;
  date: string;
  status: "confirmed" | "pending" | "cancelled";
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const EmployeePortal = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", title: "New Reservation", message: "ABC Publishers made a reservation", time: "10 min ago", read: false },
    { id: "2", title: "Payment Received", message: "LKR 85,000 received from XYZ Books", time: "1 hour ago", read: false },
    { id: "3", title: "Stall Cancelled", message: "Literary House cancelled stall C2", time: "2 hours ago", read: true },
  ]);

  const [user, setUser] = useState<any>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);


  useEffect(() => {
    // Get current user info
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);


  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearAll = () => {
    setNotifications([]);

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

  const mockReservations: Reservation[] = [
    {
      id: "R001",
      businessName: "ABC Publishers",
      contactPerson: "John Perera",
      email: "john@abc.lk",
      stalls: ["A1", "B2"],
      totalCost: 85000,
      date: "2024-01-15",
      status: "confirmed",
    },
    {
      id: "R002",
      businessName: "XYZ Books",
      contactPerson: "Sarah Silva",
      email: "sarah@xyz.lk",
      stalls: ["C3"],
      totalCost: 20000,
      date: "2024-01-16",
      status: "pending",
    },
    {
      id: "R003",
      businessName: "Literary House",
      contactPerson: "Mike Fernando",
      email: "mike@litehouse.lk",
      stalls: ["A3", "B4", "C1"],
      totalCost: 105000,
      date: "2024-01-14",
      status: "confirmed",
    },
  ];

  const stats = [
    { label: "Total Reservations", value: "48", icon: Users, color: "burgundy" },
    { label: "Available Stalls", value: "24", icon: MapPin, color: "gold" },
    { label: "Revenue", value: "LKR 2.4M", icon: TrendingUp, color: "brown" },
  ];

  const filteredReservations = mockReservations.filter((res) => {
    const matchesSearch =
      res.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || res.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-parchment to-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40 backdrop-blur-sm bg-card/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-brown to-brown-light rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-foreground">Employee Portal</h1>
                <p className="text-xs text-muted-foreground">
                  {user?.email || "SLBPA Administrator"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell 
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onClearAll={handleClearAll}
              />
              <Link to="/reservation-management">
                <Button variant="outline" size="sm">
                  <ClipboardList className="w-4 h-4 mr-2" />
                  Manage Reservations
                </Button>
              </Link>
              <Link to="/stall-management">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Stalls
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
            Reservation Management
          </h2>
          <p className="text-muted-foreground">
            Monitor and manage all stall reservations for Colombo International Bookfair
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

        {/* Filters */}
        <Card className="p-6 border-border shadow-[var(--shadow-elegant)] mb-6 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by business name, contact person, or email..."
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
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Reservations Table */}
        <Card className="border-border shadow-[var(--shadow-elegant)] overflow-hidden animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-parchment/50 border-b border-border">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm text-foreground">ID</th>
                  <th className="text-left p-4 font-semibold text-sm text-foreground">Business Name</th>
                  <th className="text-left p-4 font-semibold text-sm text-foreground">Contact</th>
                  <th className="text-left p-4 font-semibold text-sm text-foreground">Stalls</th>
                  <th className="text-left p-4 font-semibold text-sm text-foreground">Total Cost</th>
                  <th className="text-left p-4 font-semibold text-sm text-foreground">Date</th>
                  <th className="text-left p-4 font-semibold text-sm text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((reservation, index) => (
                  <tr
                    key={reservation.id}
                    className="border-b border-border hover:bg-parchment/30 transition-colors"
                    style={{ animationDelay: `${(index + 2) * 50}ms` }}
                  >
                    <td className="p-4 text-sm font-medium text-foreground">{reservation.id}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-foreground">{reservation.businessName}</p>
                        <p className="text-xs text-muted-foreground">{reservation.contactPerson}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{reservation.email}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {reservation.stalls.map((stall) => (
                          <span
                            key={stall}
                            className="px-2 py-1 bg-burgundy/10 text-burgundy text-xs font-medium rounded"
                          >
                            {stall}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-foreground">
                      LKR {reservation.totalCost.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{reservation.date}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(reservation.status)}`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {filteredReservations.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No reservations found matching your criteria</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployeePortal;
