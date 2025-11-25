import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Move, Plus, Minus, Maximize2, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

type StallSize = "small" | "medium" | "large";
type StallStatus = "available" | "reserved";

export interface Stall {
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

interface EditableVenueMapProps {
  stalls: Stall[];
  onStallsChange?: (stalls: Stall[]) => void;
  onAddStall?: (stall: {
    name: string;
    size: StallSize;
    price: number;
    x: number;
    y: number;
  }) => Promise<void> | void;
  onDeleteStall?: (id: string) => void;
  // Called when the map UI requests a delete confirmation from parent (parent should show confirm dialog)
  onRequestDelete?: (id: string) => void;
  editable?: boolean;
  selectedStalls?: string[];
  onStallClick?: (stall: Stall) => void;
}

const STALL_SIZES = {
  small: { width: 80, height: 60 },
  medium: { width: 120, height: 80 },
  large: { width: 160, height: 100 },
};

export const EditableVenueMap = ({ 
  stalls, 
  onStallsChange,
  onAddStall,
  editable = false,
  selectedStalls = [],
  onStallClick 
}: EditableVenueMapProps) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggingStall, setDraggingStall] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizingStall, setResizingStall] = useState<string | null>(null);
  const [hoveredStall, setHoveredStall] = useState<string | null>(null);
  const [showAddStallDialog, setShowAddStallDialog] = useState(false);
  const [newStallPosition, setNewStallPosition] = useState({ x: 0, y: 0 });
  const [newStallData, setNewStallData] = useState({
    name: "",
    size: "medium" as StallSize,
    price: 35000,
  });
  const [isCreatingStall, setIsCreatingStall] = useState(false);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!editable) return;
    if (e.button === 1 || e.shiftKey) { // Middle mouse or shift+click for panning
      setIsPanning(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else if (draggingStall && editable && onStallsChange) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = ((e.clientX - rect.left - pan.x) / zoom) - dragOffset.x;
      const y = ((e.clientY - rect.top - pan.y) / zoom) - dragOffset.y;
      
      onStallsChange(stalls.map(s => 
        s.id === draggingStall 
          ? { ...s, x: Math.max(50, Math.min(x, 1100 - s.width)), y: Math.max(80, Math.min(y, 850 - s.height)) }
          : s
      ));
    } else if (resizingStall && editable && onStallsChange) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const stall = stalls.find(s => s.id === resizingStall);
      if (!stall) return;
      
      const mouseX = (e.clientX - rect.left - pan.x) / zoom;
      const mouseY = (e.clientY - rect.top - pan.y) / zoom;
      
      const newWidth = Math.max(60, mouseX - stall.x);
      const newHeight = Math.max(40, mouseY - stall.y);
      
      onStallsChange(stalls.map(s => 
        s.id === resizingStall 
          ? { ...s, width: newWidth, height: newHeight }
          : s
      ));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingStall(null);
    setResizingStall(null);
  };

  const handleStallMouseDown = (e: React.MouseEvent, stallId: string) => {
    if (!editable) return;
    e.stopPropagation();
    e.preventDefault();
    
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const stall = stalls.find(s => s.id === stallId);
    if (!stall) return;
    
    const mouseX = (e.clientX - rect.left - pan.x) / zoom;
    const mouseY = (e.clientY - rect.top - pan.y) / zoom;
    
    setDraggingStall(stallId);
    setDragOffset({
      x: mouseX - stall.x,
      y: mouseY - stall.y,
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent, stallId: string) => {
    if (!editable) return;
    e.stopPropagation();
    e.preventDefault();
    setResizingStall(stallId);
  };

  const handleDeleteClick = (e: React.MouseEvent, stallId: string) => {
    if (!editable) return;
    e.stopPropagation();
    e.preventDefault();
    // If parent wants to control confirmation, ask parent to show confirm dialog
    if (typeof onRequestDelete === 'function') {
      onRequestDelete(stallId);
      return;
    }
    // Fallback: confirm here and call delete handler
    if (!window.confirm('Delete this stall?')) return;
    if (typeof onDeleteStall === 'function') {
      onDeleteStall(stallId);
    }
  };

  const handleSvgContextMenu = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!editable) return;
    e.preventDefault();
    
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;
    
    // Check if right-click is within map bounds
    if (x >= 50 && x <= 1150 && y >= 80 && y <= 860) {
      setNewStallPosition({ x: x - 60, y: y - 40 });
      setShowAddStallDialog(true);
    }
  };

  const handleAddStall = async () => {
    if (!newStallData.name.trim()) {
      toast.error("Please enter a stall name");
      return;
    }

    const sizeConfig = STALL_SIZES[newStallData.size];
    const stallPayload = {
      name: newStallData.name,
      size: newStallData.size,
      price: newStallData.price,
      x: newStallPosition.x,
      y: newStallPosition.y,
      width: sizeConfig.width,
      height: sizeConfig.height,
    };

    if (onAddStall) {
      try {
        setIsCreatingStall(true);
        await onAddStall(stallPayload);
        setShowAddStallDialog(false);
        setNewStallData({ name: "", size: "medium", price: 35000 });
      } catch (err) {
        // parent handler should surface errors (e.g., toast)
        console.error("Failed to add stall via parent handler", err);
      } finally {
        setIsCreatingStall(false);
      }
      return;
    }

    if (!onStallsChange) {
      toast.error("Map is not editable");
      return;
    }

    const newStall: Stall = {
      id: Date.now().toString(),
      status: "available",
      ...stallPayload,
    };

    onStallsChange([...stalls, newStall]);
    setShowAddStallDialog(false);
    setNewStallData({ name: "", size: "medium", price: 35000 });
    toast.success("Stall added to map");
  };

  const getStallFill = (stall: Stall) => {
    if (stall.status === "reserved") return "hsl(var(--muted))";
    if (selectedStalls.includes(stall.id)) return "hsl(var(--navy))";
    if (hoveredStall === stall.id) return "hsl(var(--navy-light))";
    return "hsl(var(--card))";
  };

  const getStallStroke = (stall: Stall) => {
    if (selectedStalls.includes(stall.id)) return "hsl(var(--navy))";
    if (hoveredStall === stall.id) return "hsl(var(--navy))";
    if (draggingStall === stall.id) return "hsl(var(--bronze))";
    return "hsl(var(--border))";
  };

  return (
    <div className="space-y-4">
      {editable && (
        <Card className="p-4 border-border shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-semibold">Zoom:</Label>
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-mono w-16 text-center">{(zoom * 100).toFixed(0)}%</span>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleResetView}>
                <Maximize2 className="w-4 h-4 mr-2" />
                Reset View
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>💡 Right-click on map to add stalls • Drag stalls to move • Drag corners to resize • Shift+Drag to pan</p>
            </div>
          </div>
        </Card>
      )}

      <div 
        ref={containerRef}
        className="w-full bg-ivory/30 rounded-lg border border-border overflow-hidden"
        style={{ height: "700px" }}
      >
        <div className="w-full h-full overflow-auto">
          <svg
            ref={svgRef}
            viewBox="0 0 1200 900"
            className="w-full h-auto cursor-move"
            style={{ 
              minWidth: "1200px",
              minHeight: "900px",
              // prevent browser text selection while dragging
              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transformOrigin: "0 0",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onContextMenu={handleSvgContextMenu}
          >
            {/* Background */}
            <rect x="0" y="0" width="1200" height="900" fill="hsl(var(--ivory) / 0.3)" />

            {/* Main Hall Border */}
            <rect
              x="20"
              y="20"
              width="1160"
              height="860"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="3"
              rx="10"
            />


            {/* Main Entrance */}
            <rect x="500" y="20" width="200" height="40" fill="hsl(var(--navy))" rx="5" />
            <text
              x="600"
              y="45"
              textAnchor="middle"
              className="fill-primary-foreground font-semibold"
              fontSize="14"
            >
              MAIN ENTRANCE
            </text>

            {/* Horizontal Pathways */}
            <rect x="50" y="200" width="1100" height="60" fill="hsl(var(--muted) / 0.3)" />
            <rect x="50" y="450" width="1100" height="60" fill="hsl(var(--muted) / 0.3)" />
            <rect x="50" y="700" width="1100" height="60" fill="hsl(var(--muted) / 0.3)" />

            {/* Vertical Central Pathway */}
            <rect x="570" y="80" width="60" height="780" fill="hsl(var(--muted) / 0.3)" />

            {/* Information Desk */}
            <circle cx="600" cy="230" r="35" fill="hsl(var(--bronze))" stroke="hsl(var(--bronze-dark))" strokeWidth="2" />
            <text x="600" y="228" textAnchor="middle" className="fill-foreground font-bold" fontSize="12">INFO</text>
            <text x="600" y="242" textAnchor="middle" className="fill-foreground font-bold" fontSize="12">DESK</text>

            {/* Food Court */}
            <rect x="450" y="820" width="120" height="60" fill="hsl(var(--bronze) / 0.2)" stroke="hsl(var(--bronze))" strokeWidth="2" rx="5" />
            <text x="510" y="845" textAnchor="middle" className="fill-foreground font-semibold" fontSize="14">Food Court</text>
            <text x="510" y="863" textAnchor="middle" className="fill-muted-foreground" fontSize="18">🍽️</text>

            {/* Restrooms */}
            <rect x="630" y="820" width="120" height="60" fill="hsl(var(--muted) / 0.5)" stroke="hsl(var(--border))" strokeWidth="2" rx="5" />
            <text x="690" y="845" textAnchor="middle" className="fill-foreground font-semibold" fontSize="14">Restrooms</text>
            <text x="690" y="863" textAnchor="middle" className="fill-muted-foreground" fontSize="18">🚻</text>

            {/* Section Labels - with background for visibility */}
            <rect x="200" y="115" width="100" height="25" fill="hsl(var(--background))" opacity="0.9" rx="4" />
            <text x="250" y="50" textAnchor="middle" className="fill-navy font-serif font-bold" fontSize="20">Section A</text>
            
            <rect x="800" y="115" width="100" height="25" fill="hsl(var(--background))" opacity="0.9" rx="4" />
            <text x="850" y="50" textAnchor="middle" className="fill-navy font-serif font-bold" fontSize="20">Section B</text>
            
            <rect x="200" y="335" width="100" height="25" fill="hsl(var(--background))" opacity="0.9" rx="4" />
            <text x="250" y="255" textAnchor="middle" className="fill-navy font-serif font-bold" fontSize="20">Section C</text>
            
            <rect x="800" y="335" width="100" height="25" fill="hsl(var(--background))" opacity="0.9" rx="4" />
            <text x="850" y="255" textAnchor="middle" className="fill-navy font-serif font-bold" fontSize="20">Section D</text>
            
            <rect x="200" y="585" width="100" height="25" fill="hsl(var(--background))" opacity="0.9" rx="4" />
            <text x="250" y="505" textAnchor="middle" className="fill-navy font-serif font-bold" fontSize="20">Section E</text>
            
            <rect x="800" y="585" width="100" height="25" fill="hsl(var(--background))" opacity="0.9" rx="4" />
            <text x="850" y="505" textAnchor="middle" className="fill-navy font-serif font-bold" fontSize="20">Section F</text>

            {/* Stalls */}
            {stalls.map((stall) => {
              const isHovered = hoveredStall === stall.id;
              const isSelected = selectedStalls.includes(stall.id);
              const isDragging = draggingStall === stall.id;
              
              return (
                <g
                  key={stall.id}
                  onMouseEnter={() => setHoveredStall(stall.id)}
                  onMouseLeave={() => setHoveredStall(null)}
                  onClick={(e) => {
                    if (!editable && onStallClick) {
                      e.stopPropagation();
                      onStallClick(stall);
                    }
                  }}
                  className={editable ? "cursor-move" : stall.status === "reserved" ? "cursor-not-allowed" : "cursor-pointer"}
                >
                  <rect
                    x={stall.x}
                    y={stall.y}
                    width={stall.width}
                    height={stall.height}
                    fill={getStallFill(stall)}
                    stroke={getStallStroke(stall)}
                    strokeWidth={isHovered || isSelected || isDragging ? "3" : "2"}
                    rx="4"
                    opacity={stall.status === "reserved" && !editable ? 0.5 : 1}
                    onMouseDown={(e) => editable && handleStallMouseDown(e, stall.id)}
                  />
                  
                  {/* Stall Info */}
                  <text
                    x={stall.x + stall.width / 2}
                    y={stall.y + stall.height / 2 - 8}
                    textAnchor="middle"
                    className={selectedStalls.includes(stall.id) ? "fill-primary-foreground font-bold" : "fill-foreground font-semibold"}
                    fontSize="14"
                    pointerEvents="none"
                  >
                    {stall.name}
                  </text>
                  
                  <text
                    x={stall.x + stall.width / 2}
                    y={stall.y + stall.height / 2 + 6}
                    textAnchor="middle"
                    className={selectedStalls.includes(stall.id) ? "fill-primary-foreground" : "fill-muted-foreground"}
                    fontSize="10"
                    pointerEvents="none"
                  >
                    {stall.size.toUpperCase()}
                  </text>
                  
                  <text
                    x={stall.x + stall.width / 2}
                    y={stall.y + stall.height / 2 + 18}
                    textAnchor="middle"
                    className={selectedStalls.includes(stall.id) ? "fill-primary-foreground" : "fill-muted-foreground"}
                    fontSize="9"
                    pointerEvents="none"
                  >
                    LKR {(stall.price / 1000).toFixed(0)}K
                  </text>

                  {stall.status === "reserved" && !editable && (
                    <text
                      x={stall.x + stall.width / 2}
                      y={stall.y + stall.height / 2 + 30}
                      textAnchor="middle"
                      className="fill-muted-foreground font-bold"
                      fontSize="10"
                      pointerEvents="none"
                    >
                      RESERVED
                    </text>
                  )}

                  {isSelected && !editable && (
                    <>
                      <circle
                        cx={stall.x + stall.width - 15}
                        cy={stall.y + 15}
                        r="10"
                        fill="hsl(var(--bronze))"
                        pointerEvents="none"
                      />
                      <text
                        x={stall.x + stall.width - 15}
                        y={stall.y + 20}
                        textAnchor="middle"
                        className="fill-foreground font-bold"
                        fontSize="12"
                        pointerEvents="none"
                      >
                        ✓
                      </text>
                    </>
                  )}

                  {/* Resize handle */}
                  {editable && isHovered && (
                    <>
                      <circle
                        cx={stall.x + stall.width}
                        cy={stall.y + stall.height}
                        r="8"
                        fill="hsl(var(--bronze))"
                        stroke="hsl(var(--bronze-dark))"
                        strokeWidth="2"
                        className="cursor-nwse-resize"
                        onMouseDown={(e) => handleResizeMouseDown(e, stall.id)}
                      />

                      {/* Delete control (top-right) */}
                      <g onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                        <circle
                          cx={stall.x + stall.width - 10}
                          cy={stall.y + 10}
                          r="10"
                          fill="hsl(var(--bronze))"
                          stroke="hsl(var(--bronze-dark))"
                          strokeWidth="1"
                          className="cursor-pointer"
                          onClick={(e) => handleDeleteClick(e, stall.id)}
                        />
                        <text
                          x={stall.x + stall.width - 10}
                          y={stall.y + 14}
                          textAnchor="middle"
                          className="fill-foreground font-bold"
                          fontSize="12"
                          pointerEvents="none"
                        >
                          ✖
                        </text>
                      </g>
                    </>
                  )}
                </g>
              );
            })}

            {/* Legend */}
            <g transform="translate(50, 820)">
              <text className="fill-foreground font-semibold" fontSize="12" y="15">Legend:</text>
              
              <rect x="80" y="5" width="20" height="20" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" rx="2" />
              <text className="fill-foreground" fontSize="11" x="105" y="19">Available</text>
              
              {!editable && (
                <>
                  <rect x="180" y="5" width="20" height="20" fill="hsl(var(--navy))" rx="2" />
                  <text className="fill-foreground" fontSize="11" x="205" y="19">Selected</text>
                  
                  <rect x="280" y="5" width="20" height="20" fill="hsl(var(--muted))" opacity="0.5" rx="2" />
                  <text className="fill-foreground" fontSize="11" x="305" y="19">Reserved</text>
                </>
              )}
            </g>
          </svg>
        </div>
      </div>

      {/* Add Stall Dialog */}
      <Dialog open={showAddStallDialog} onOpenChange={setShowAddStallDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Add New Stall to Map</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="stall-name">Stall Name</Label>
              <Input
                id="stall-name"
                placeholder="e.g., A1, B2"
                value={newStallData.name}
                onChange={(e) => setNewStallData({ ...newStallData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stall-size">Size</Label>
              <Select 
                value={newStallData.size} 
                onValueChange={(value: StallSize) => setNewStallData({ ...newStallData, size: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (80x60)</SelectItem>
                  <SelectItem value="medium">Medium (120x80)</SelectItem>
                  <SelectItem value="large">Large (160x100)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stall-price">Price (LKR)</Label>
              <Input
                id="stall-price"
                type="number"
                value={newStallData.price}
                onChange={(e) => setNewStallData({ ...newStallData, price: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddStallDialog(false)}>
              Cancel
            </Button>
            <Button variant="elegant" onClick={handleAddStall} disabled={isCreatingStall}>
              Add Stall
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};