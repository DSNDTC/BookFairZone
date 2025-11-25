import { useState, useEffect, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Plus, Edit, Trash2, Search, Map } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { NotificationBell } from "@/components/NotificationBell";
import { EditableVenueMap, Stall as MapStall } from "@/components/EditableVenueMap";
import { stallApi } from '@/lib/api';

interface Stall {
  id: string;
  name: string;
  size: "small" | "medium" | "large";
  price: number;
  status: "available" | "reserved";
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const StallManagement = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');
  const [stalls, setStalls] = useState<Stall[]>([
    { id: "1", name: "A1", size: "large", price: 50000, status: "available", x: 70, y: 150, width: 160, height: 100 },
    { id: "2", name: "A2", size: "large", price: 50000, status: "reserved", x: 250, y: 150, width: 160, height: 100 },
    { id: "3", name: "B1", size: "medium", price: 35000, status: "available", x: 650, y: 150, width: 120, height: 80 },
    { id: "4", name: "B2", size: "medium", price: 35000, status: "available", x: 800, y: 150, width: 120, height: 80 },
    { id: "5", name: "C1", size: "small", price: 20000, status: "available", x: 70, y: 280, width: 80, height: 60 },
    { id: "6", name: "C2", size: "small", price: 20000, status: "available", x: 170, y: 280, width: 80, height: 60 },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", title: "New Reservation", message: "ABC Publishers reserved stall A2", time: "5 min ago", read: false },
    { id: "2", title: "Stall Updated", message: "Stall B1 price updated", time: "1 hour ago", read: false },
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [pendingMoves, setPendingMoves] = useState<Record<string, { x?: number; y?: number }>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStall, setEditingStall] = useState<Stall | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    size: "small" as "small" | "medium" | "large",
    price: 20000,
  });

  // Load stalls from backend
  const loadStalls = async () => {
    try {
      const data = await stallApi.fetchAll();
      // Map server stalls to local Stall shape
      const mapped: Stall[] = data.map((s: any) => ({
        id: String(s.id),
        name: s.code,
        size: (s.size || 'SMALL').toLowerCase(),
        price: Number(s.price),
        status: s.isReserved ? 'reserved' : 'available',
        x: Number(s.locationX),
        y: Number(s.locationY),
        width: s.size === 'LARGE' ? 160 : s.size === 'MEDIUM' ? 120 : 80,
        height: s.size === 'LARGE' ? 100 : s.size === 'MEDIUM' ? 80 : 60,
      }));

      setStalls(mapped);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load stalls');
    }
  };

  // Load on mount
  useEffect(() => {
    loadStalls();
  }, []);

  const handleCreateStall = async () => {
    // Prepare payload
    const payload = {
      code: formData.name,
      size: formData.size.toUpperCase(),
      price: String(formData.price),
      isReserved: false,
      locationX: String(100),
      locationY: String(100),
    };

    try {
      const created = await stallApi.create(payload);

      // Map to local Stall and add
      const sizeUpper = payload.size;
      const newLocal: Stall = {
        id: String(created.id || Date.now()),
        name: created.code || formData.name,
        size: (created.size || sizeUpper).toLowerCase(),
        price: Number(created.price || formData.price),
        status: created.isReserved ? 'reserved' : 'available',
        x: Number(created.locationX || 100),
        y: Number(created.locationY || 100),
        width: sizeUpper === 'LARGE' ? 160 : sizeUpper === 'MEDIUM' ? 120 : 80,
        height: sizeUpper === 'LARGE' ? 100 : sizeUpper === 'MEDIUM' ? 80 : 60,
      };

      setStalls(prev => [newLocal, ...prev]);
      setShowCreateDialog(false);
      setFormData({ name: "", size: "small", price: 20000 });
      toast.success('Stall created successfully');

      const newNotification: Notification = {
        id: Date.now().toString(),
        title: 'Stall Created',
        message: `New stall ${newLocal.name} has been created`,
        time: 'Just now',
        read: false,
      };
      setNotifications(prev => [newNotification, ...prev]);
    } catch (err:any) {
      console.error(err);
      toast.error('Failed to create stall');
    }
  };

  const handleMapStallsChange = (updatedStalls: MapStall[]) => {
    // Update local positions first
    const updatedLocal = updatedStalls.map(s => ({
      id: s.id,
      name: s.name,
      size: s.size,
      price: s.price,
      status: s.status,
      x: s.x,
      y: s.y,
      width: s.width,
      height: s.height,
    }));

    // Detect changed stalls by comparing previous coordinates
    const changed = updatedLocal.filter(us => {
      const prev = stalls.find(s => s.id === us.id);
      return prev && (prev.x !== us.x || prev.y !== us.y);
    });

    setStalls(updatedLocal);

    // Record pending moves (do NOT call API here). User will click Save to persist.
    if (changed.length > 0) {
      setPendingMoves(prev => {
        const next = { ...prev };
        changed.forEach(c => {
          next[c.id] = { x: c.x, y: c.y };
        });
        return next;
      });
    }
  };

  const savePendingMoves = async () => {
    const entries = Object.entries(pendingMoves);
    if (entries.length === 0) return;

    try {
      const body = entries.map(([id, pos]) => ({
        id: Number(id),
        locationX: Number(pos?.x ?? 0),
        locationY: Number(pos?.y ?? 0),
      }));

      await stallApi.updateLocations(body);

      toast.success('Positions saved');
      setPendingMoves({});
      await loadStalls();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save stall positions');
      await loadStalls();
    }
  };

  const cancelPendingMoves = async () => {
    setPendingMoves({});
    await loadStalls();
  };

  const handleEditStall = () => {
    if (!editingStall) return;
    setStalls(stalls.map(s => s.id === editingStall.id ? {
      ...s,
      name: formData.name,
      size: formData.size,
      price: formData.price,
    } : s));
    setShowEditDialog(false);
    setEditingStall(null);
    toast.success("Stall updated successfully!");
    
    // Add notification
    const newNotification: Notification = {
      id: Date.now().toString(),
      title: "Stall Updated",
      message: `Stall ${formData.name} has been updated`,
      time: "Just now",
      read: false,
    };
    setNotifications([newNotification, ...notifications]);
  };

  const handleDeleteStall = (id: string) => {
    const stall = stalls.find(s => s.id === id);
    if (stall?.status === "reserved") {
      toast.error("Cannot delete reserved stall");
      return;
    }
    setStalls(stalls.filter(s => s.id !== id));
    toast.success("Stall deleted successfully!");
  };

  const openEditDialog = (stall: Stall) => {
    setEditingStall(stall);
    setFormData(prev => ({ ...prev, name: stall.name, size: stall.size, price: stall.price }));
    setShowEditDialog(true);
  };

  const filteredStalls = stalls.filter(stall =>
    stall.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-parchment to-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40 backdrop-blur-sm bg-card/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-navy to-navy/80 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-foreground">Stall Management</h1>
                <p className="text-xs text-muted-foreground">Manage venue stalls</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell 
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onClearAll={handleClearAll}
              />
              <Link to="/employee-portal">
                <Button variant="outline" size="sm">
                  Back to Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as 'list' | 'map')} className="w-full">
          <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="map">
                <Map className="w-4 h-4 mr-2" />
                Map Editor
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
                <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search stalls..."
                  value={searchQuery}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {activeTab === 'map' && (
                <div className="flex items-center gap-2">
                  {Object.keys(pendingMoves).length > 0 && (
                    <>
                      <Button variant="outline" onClick={savePendingMoves} disabled={Object.keys(pendingMoves).length === 0}>
                        Save Changes
                      </Button>
                      <Button variant="ghost" onClick={cancelPendingMoves}>
                        Cancel Changes
                      </Button>
                    </>
                  )}

                  <Button onClick={() => setShowCreateDialog(true)} variant="elegant">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Stall
                  </Button>
                </div>
              )}
            </div>
          </div>

          <TabsContent value="list">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStalls.map((stall) => (
                <Card key={stall.id} className="p-6 border-border shadow-[var(--shadow-elegant)] animate-fade-in">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-foreground">{stall.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{stall.size}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      stall.status === "available" 
                        ? "bg-emerald/10 text-emerald" 
                        : "bg-bronze/10 text-bronze"
                    }`}>
                      {stall.status}
                    </span>
                  </div>
                  
                  <p className="text-xl font-bold text-foreground mb-4">
                    LKR {stall.price.toLocaleString()}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(stall)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteStall(stall.id)}
                      disabled={stall.status === "reserved"}
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map">
            <EditableVenueMap 
              stalls={stalls as MapStall[]}
              onStallsChange={handleMapStallsChange}
              editable={true}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Create New Stall</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Stall Name</Label>
              <Input
                id="name"
                placeholder="e.g., A1, B2"
                value={formData.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Select value={formData.size} onValueChange={(value: any) => setFormData({ ...formData, size: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (LKR)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
              />
            </div>
            {/* vendorId removed - not required for stall management */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button variant="elegant" onClick={handleCreateStall}>
              Create Stall
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Edit Stall</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Stall Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-size">Size</Label>
              <Select value={formData.size} onValueChange={(value: any) => setFormData({ ...formData, size: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price (LKR)</Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.price}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button variant="elegant" onClick={handleEditStall}>
              Update Stall
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StallManagement;
