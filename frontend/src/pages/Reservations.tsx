import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { BookOpen, ArrowLeft, MapPin, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { EditableVenueMap, Stall as MapStall } from "@/components/EditableVenueMap";
import { NotificationBell } from "@/components/NotificationBell";

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
  const [stalls, setStalls] = useState<Stall[]>([
    // Section A - Large stalls (Top Left)
    { id: "1", name: "A1", size: "large", status: "available", price: 50000, x: 60, y: 150, width: 150, height: 90 },
    { id: "2", name: "A2", size: "large", status: "reserved", price: 50000, x: 220, y: 150, width: 150, height: 90 },
    { id: "3", name: "A3", size: "large", status: "available", price: 50000, x: 380, y: 150, width: 150, height: 90 },
    
    // Section B - Large stalls (Top Right)
    { id: "4", name: "B1", size: "large", status: "available", price: 50000, x: 650, y: 150, width: 150, height: 90 },
    { id: "5", name: "B2", size: "large", status: "available", price: 50000, x: 810, y: 150, width: 150, height: 90 },
    { id: "6", name: "B3", size: "large", status: "reserved", price: 50000, x: 970, y: 150, width: 150, height: 90 },
    
    // Section C - Medium stalls (Middle Left Top)
    { id: "7", name: "C1", size: "medium", status: "available", price: 35000, x: 60, y: 270, width: 120, height: 70 },
    { id: "8", name: "C2", size: "medium", status: "available", price: 35000, x: 190, y: 270, width: 120, height: 70 },
    { id: "9", name: "C3", size: "medium", status: "reserved", price: 35000, x: 320, y: 270, width: 120, height: 70 },
    { id: "10", name: "C4", size: "medium", status: "available", price: 35000, x: 450, y: 270, width: 120, height: 70 },
    
    // Section D - Medium stalls (Middle Right Top)
    { id: "11", name: "D1", size: "medium", status: "available", price: 35000, x: 650, y: 270, width: 120, height: 70 },
    { id: "12", name: "D2", size: "medium", status: "available", price: 35000, x: 780, y: 270, width: 120, height: 70 },
    { id: "13", name: "D3", size: "medium", status: "available", price: 35000, x: 910, y: 270, width: 120, height: 70 },
    { id: "14", name: "D4", size: "medium", status: "reserved", price: 35000, x: 1040, y: 270, width: 120, height: 70 },
    
    // Section C - Medium stalls (Middle Left Bottom)
    { id: "15", name: "C5", size: "medium", status: "available", price: 35000, x: 60, y: 360, width: 120, height: 70 },
    { id: "16", name: "C6", size: "medium", status: "available", price: 35000, x: 190, y: 360, width: 120, height: 70 },
    { id: "17", name: "C7", size: "medium", status: "available", price: 35000, x: 320, y: 360, width: 120, height: 70 },
    { id: "18", name: "C8", size: "medium", status: "available", price: 35000, x: 450, y: 360, width: 120, height: 70 },
    
    // Section D - Medium stalls (Middle Right Bottom)
    { id: "19", name: "D5", size: "medium", status: "available", price: 35000, x: 650, y: 360, width: 120, height: 70 },
    { id: "20", name: "D6", size: "medium", status: "reserved", price: 35000, x: 780, y: 360, width: 120, height: 70 },
    { id: "21", name: "D7", size: "medium", status: "available", price: 35000, x: 910, y: 360, width: 120, height: 70 },
    { id: "22", name: "D8", size: "medium", status: "available", price: 35000, x: 1040, y: 360, width: 120, height: 70 },
    
    // Section E - Small stalls (Bottom Left Top Row)
    { id: "23", name: "E1", size: "small", status: "available", price: 20000, x: 60, y: 520, width: 90, height: 60 },
    { id: "24", name: "E2", size: "small", status: "available", price: 20000, x: 160, y: 520, width: 90, height: 60 },
    { id: "25", name: "E3", size: "small", status: "reserved", price: 20000, x: 260, y: 520, width: 90, height: 60 },
    { id: "26", name: "E4", size: "small", status: "available", price: 20000, x: 360, y: 520, width: 90, height: 60 },
    { id: "27", name: "E5", size: "small", status: "available", price: 20000, x: 460, y: 520, width: 90, height: 60 },
    
    // Section F - Small stalls (Bottom Right Top Row)
    { id: "28", name: "F1", size: "small", status: "available", price: 20000, x: 650, y: 520, width: 90, height: 60 },
    { id: "29", name: "F2", size: "small", status: "available", price: 20000, x: 750, y: 520, width: 90, height: 60 },
    { id: "30", name: "F3", size: "small", status: "available", price: 20000, x: 850, y: 520, width: 90, height: 60 },
    { id: "31", name: "F4", size: "small", status: "reserved", price: 20000, x: 950, y: 520, width: 90, height: 60 },
    { id: "32", name: "F5", size: "small", status: "available", price: 20000, x: 1050, y: 520, width: 90, height: 60 },
    
    // Section E - Small stalls (Bottom Left Middle Row)
    { id: "33", name: "E6", size: "small", status: "available", price: 20000, x: 60, y: 590, width: 90, height: 60 },
    { id: "34", name: "E7", size: "small", status: "available", price: 20000, x: 160, y: 590, width: 90, height: 60 },
    { id: "35", name: "E8", size: "small", status: "available", price: 20000, x: 260, y: 590, width: 90, height: 60 },
    { id: "36", name: "E9", size: "small", status: "available", price: 20000, x: 360, y: 590, width: 90, height: 60 },
    { id: "37", name: "E10", size: "small", status: "reserved", price: 20000, x: 460, y: 590, width: 90, height: 60 },
    
    // Section F - Small stalls (Bottom Right Middle Row)
    { id: "38", name: "F6", size: "small", status: "available", price: 20000, x: 650, y: 590, width: 90, height: 60 },
    { id: "39", name: "F7", size: "small", status: "available", price: 20000, x: 750, y: 590, width: 90, height: 60 },
    { id: "40", name: "F8", size: "small", status: "available", price: 20000, x: 850, y: 590, width: 90, height: 60 },
    { id: "41", name: "F9", size: "small", status: "available", price: 20000, x: 950, y: 590, width: 90, height: 60 },
    { id: "42", name: "F10", size: "small", status: "available", price: 20000, x: 1050, y: 590, width: 90, height: 60 },
    
    // Section E - Small stalls (Bottom Left Bottom Row)
    { id: "43", name: "E11", size: "small", status: "available", price: 20000, x: 60, y: 660, width: 90, height: 60 },
    { id: "44", name: "E12", size: "small", status: "available", price: 20000, x: 160, y: 660, width: 90, height: 60 },
    { id: "45", name: "E13", size: "small", status: "available", price: 20000, x: 260, y: 660, width: 90, height: 60 },
    { id: "46", name: "E14", size: "small", status: "available", price: 20000, x: 360, y: 660, width: 90, height: 60 },
    { id: "47", name: "E15", size: "small", status: "available", price: 20000, x: 460, y: 660, width: 90, height: 60 },
    
    // Section F - Small stalls (Bottom Right Bottom Row)
    { id: "48", name: "F11", size: "small", status: "available", price: 20000, x: 650, y: 660, width: 90, height: 60 },
    { id: "49", name: "F12", size: "small", status: "reserved", price: 20000, x: 750, y: 660, width: 90, height: 60 },
    { id: "50", name: "F13", size: "small", status: "available", price: 20000, x: 850, y: 660, width: 90, height: 60 },
  ]);

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

  const handleFinalizeReservation = () => {
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
