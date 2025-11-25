import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { BookOpen, ArrowLeft, MapPin, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { EditableVenueMap, Stall as MapStall } from "@/components/EditableVenueMap";
import { NotificationBell } from "@/components/NotificationBell";
import { stallApi, reservationApi } from "@/lib/api";

type StallSize = "small" | "medium" | "large";
type StallStatus = "available" | "reserved" | "selected";

interface Stall {
  id: string;
  name: string;
  size: StallSize;
  status: StallStatus;
  price: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const Reservations = () => {
  const [selectedStalls, setSelectedStalls] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", title: "Welcome", message: "Select stalls to make a reservation", time: "Just now", read: false },
  ]);
  const [stalls, setStalls] = useState<Stall[]>([]);

  const loadStalls = async () => {
    try {
      const data = await stallApi.fetchAll();
      const mapSizeToDimensions = (size: StallSize) => {
        switch (size) {
          case "large":
            return { width: 160, height: 100 };
          case "medium":
            return { width: 120, height: 80 };
          default:
            return { width: 80, height: 60 };
        }
      };

      const mapped: Stall[] = data.map((s: any) => {
        const size = (s.size || "SMALL").toLowerCase() as StallSize;
        const { width, height } = mapSizeToDimensions(size);
        return {
          id: String(s.id),
          name: s.code,
          size,
          status: s.isReserved ? "reserved" : "available",
          price: Number(s.price),
          x: Number(s.locationX) || 0,
          y: Number(s.locationY) || 0,
          width,
          height,
        };
      });

      setStalls(mapped);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load stalls");
    }
  };

  useEffect(() => {
    loadStalls();
  }, []);

  const handleStallClick = (stall: Stall) => {
    if (stall.status === "reserved") return;

    if (selectedStalls.includes(stall.id)) {
      setSelectedStalls(selectedStalls.filter((id) => id !== stall.id));
    } else {
      if (selectedStalls.length >= 3) {
        toast.error("Maximum 3 stalls can be reserved per business");
        return;
      }
      setSelectedStalls([...selectedStalls, stall.id]);
    }
  };

  const handleConfirmReservation = () => {
    if (selectedStalls.length === 0) {
      toast.error("Please select at least one stall");
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleFinalizeReservation = async () => {
    try {
      // Call the reservation API for each selected stall
      const reservationPromises = selectedStalls.map((stallId) =>
        reservationApi.createReservation(Number(stallId))
      );

      const results = await Promise.all(reservationPromises);
      
      // Update stalls status locally
      setStalls(
        stalls.map((stall) =>
          selectedStalls.includes(stall.id) ? { ...stall, status: "reserved" as StallStatus } : stall
        )
      );
      
      // Add notification
      const newNotification: Notification = {
        id: Date.now().toString(),
        title: "Reservation Confirmed",
        message: `Successfully reserved ${selectedStalls.length} stall(s). Total: LKR ${totalCost.toLocaleString()}`,
        time: "Just now",
        read: false,
      };
      setNotifications([newNotification, ...notifications]);
      
      setSelectedStalls([]);
      setShowConfirmDialog(false);
      toast.success("Reservation confirmed! Check your email for details.");
      
      // Reload stalls to get updated status from backend
      await loadStalls();
    } catch (error: any) {
      console.error("Reservation error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create reservation";
      toast.error(errorMessage);
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getStallColor = (stall: Stall) => {
    if (stall.status === "reserved") return "bg-muted text-muted-foreground cursor-not-allowed";
    if (selectedStalls.includes(stall.id)) return "bg-burgundy text-primary-foreground shadow-[var(--shadow-book)]";
    return "bg-card border-2 border-border hover:border-burgundy hover:shadow-[var(--shadow-elegant)] cursor-pointer transition-all duration-300";
  };


  const totalCost = selectedStalls.reduce((sum, id) => {
    const stall = stalls.find((s) => s.id === id);
    return sum + (stall?.price || 0);
  }, 0);

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
              <div className="w-10 h-10 bg-gradient-to-br from-navy to-navy/80 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="font-serif text-xl font-bold text-foreground">Stall Reservations</h1>
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
            Select Your Stalls
          </h2>
          <p className="text-muted-foreground">
            Click on available stalls to select them. You can reserve up to 3 stalls.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="p-6 border-border shadow-[var(--shadow-elegant)] animate-fade-in">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-burgundy" />
                  Venue Map
                </h3>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-card border-2 border-border rounded" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-burgundy rounded" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted rounded" />
                    <span>Reserved</span>
                  </div>
                </div>
              </div>

              {/* Interactive Venue Map */}
          <EditableVenueMap
            stalls={stalls as MapStall[]}
            selectedStalls={selectedStalls}
            onStallClick={handleStallClick}
            editable={false}
          />
            </Card>
          </div>

          {/* Summary Section */}
          <div className="space-y-4">
            <Card className="p-6 border-border shadow-[var(--shadow-elegant)] animate-fade-in-scale sticky top-24">
              <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                Reservation Summary
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Selected Stalls ({selectedStalls.length}/3)</p>
                  {selectedStalls.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No stalls selected</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedStalls.map((id) => {
                        const stall = stalls.find((s) => s.id === id);
                        return (
                          <div key={id} className="flex items-center justify-between bg-parchment/50 p-2 rounded">
                            <span className="font-medium">{stall?.name}</span>
                            <span className="text-sm text-muted-foreground capitalize">{stall?.size}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Total Cost</span>
                    <span className="text-2xl font-bold text-foreground">
                      LKR {totalCost.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button
                  variant="elegant"
                  size="lg"
                  className="w-full"
                  onClick={handleConfirmReservation}
                  disabled={selectedStalls.length === 0}
                >
                  Confirm Reservation
                </Button>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold text-sm mb-2">Stall Sizes</h4>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p>• <strong>Small:</strong> 10ft x 10ft - LKR 20,000</p>
                    <p>• <strong>Medium:</strong> 15ft x 10ft - LKR 35,000</p>
                    <p>• <strong>Large:</strong> 20ft x 15ft - LKR 50,000</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Confirm Reservation</DialogTitle>
            <DialogDescription>
              Please review your stall selection before confirming
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-parchment/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Selected Stalls:</h4>
              <div className="space-y-2">
                {selectedStalls.map((id) => {
                  const stall = stalls.find((s) => s.id === id);
                  return (
                    <div key={id} className="flex items-center justify-between">
                      <span>{stall?.name} ({stall?.size})</span>
                      <span>LKR {stall?.price.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between font-bold">
                <span>Total:</span>
                <span>LKR {totalCost.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-burgundy/10 border border-burgundy/20 p-3 rounded-lg flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                Upon confirmation, you'll receive an email with your QR code pass and payment instructions.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="elegant" onClick={handleFinalizeReservation}>
              Confirm & Reserve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reservations;
