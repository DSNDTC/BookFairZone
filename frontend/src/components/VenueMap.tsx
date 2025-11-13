import { useState } from "react";

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

interface VenueMapProps {
  stalls: Stall[];
  selectedStalls: string[];
  onStallClick: (stall: Stall) => void;
}

export const VenueMap = ({ stalls, selectedStalls, onStallClick }: VenueMapProps) => {
  const [hoveredStall, setHoveredStall] = useState<string | null>(null);

  const getStallFill = (stall: Stall) => {
    if (stall.status === "reserved") return "hsl(var(--muted))";
    if (selectedStalls.includes(stall.id)) return "hsl(var(--navy))";
    if (hoveredStall === stall.id) return "hsl(var(--navy-light))";
    return "hsl(var(--card))";
  };

  const getStallStroke = (stall: Stall) => {
    if (selectedStalls.includes(stall.id)) return "hsl(var(--navy))";
    if (hoveredStall === stall.id) return "hsl(var(--navy))";
    return "hsl(var(--border))";
  };

  return (
    <div className="w-full bg-ivory/30 rounded-lg border border-border p-4 overflow-auto">
      <svg
        viewBox="0 0 1200 900"
        className="w-full h-auto"
        style={{ minHeight: "600px" }}
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
        <rect x="150" y="820" width="200" height="60" fill="hsl(var(--bronze) / 0.2)" stroke="hsl(var(--bronze))" strokeWidth="2" rx="5" />
        <text x="250" y="845" textAnchor="middle" className="fill-foreground font-semibold" fontSize="14">Food Court</text>
        <text x="250" y="863" textAnchor="middle" className="fill-muted-foreground" fontSize="10">🍽️</text>

        {/* Restrooms */}
        <rect x="850" y="820" width="200" height="60" fill="hsl(var(--muted) / 0.5)" stroke="hsl(var(--border))" strokeWidth="2" rx="5" />
        <text x="950" y="845" textAnchor="middle" className="fill-foreground font-semibold" fontSize="14">Restrooms</text>
        <text x="950" y="863" textAnchor="middle" className="fill-muted-foreground" fontSize="10">🚻</text>

        {/* Section Labels - with background for visibility */}
        <rect x="200" y="115" width="100" height="25" fill="hsl(var(--background))" opacity="0.9" rx="4" />
        <text x="250" y="133" textAnchor="middle" className="fill-navy font-serif font-bold" fontSize="20">Section A</text>
        
        <rect x="800" y="115" width="100" height="25" fill="hsl(var(--background))" opacity="0.9" rx="4" />
        <text x="850" y="133" textAnchor="middle" className="fill-navy font-serif font-bold" fontSize="20">Section B</text>
        
        <rect x="200" y="335" width="100" height="25" fill="hsl(var(--background))" opacity="0.9" rx="4" />
        <text x="250" y="353" textAnchor="middle" className="fill-navy font-serif font-bold" fontSize="20">Section C</text>
        
        <rect x="800" y="335" width="100" height="25" fill="hsl(var(--background))" opacity="0.9" rx="4" />
        <text x="850" y="353" textAnchor="middle" className="fill-navy font-serif font-bold" fontSize="20">Section D</text>
        
        <rect x="200" y="585" width="100" height="25" fill="hsl(var(--background))" opacity="0.9" rx="4" />
        <text x="250" y="603" textAnchor="middle" className="fill-navy font-serif font-bold" fontSize="20">Section E</text>
        
        <rect x="800" y="585" width="100" height="25" fill="hsl(var(--background))" opacity="0.9" rx="4" />
        <text x="850" y="603" textAnchor="middle" className="fill-navy font-serif font-bold" fontSize="20">Section F</text>

        {/* Stalls */}
        {stalls.map((stall) => {
          const isHovered = hoveredStall === stall.id;
          const isSelected = selectedStalls.includes(stall.id);
          
          return (
            <g
              key={stall.id}
              onMouseEnter={() => setHoveredStall(stall.id)}
              onMouseLeave={() => setHoveredStall(null)}
              onClick={() => onStallClick(stall)}
              className={stall.status === "reserved" ? "cursor-not-allowed" : "cursor-pointer"}
              style={{ transition: "all 0.3s ease" }}
            >
              <rect
                x={stall.x}
                y={stall.y}
                width={stall.width}
                height={stall.height}
                fill={getStallFill(stall)}
                stroke={getStallStroke(stall)}
                strokeWidth={isHovered || isSelected ? "3" : "2"}
                rx="4"
                opacity={stall.status === "reserved" ? 0.5 : 1}
                style={{
                  transform: isHovered && stall.status !== "reserved" ? "scale(1.05)" : "scale(1)",
                  transformOrigin: `${stall.x + stall.width / 2}px ${stall.y + stall.height / 2}px`,
                  transition: "all 0.3s ease"
                }}
              />
              
              {/* Stall Name */}
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
              
              {/* Stall Size */}
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
              
              {/* Stall Price */}
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

              {/* Reserved indicator */}
              {stall.status === "reserved" && (
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

              {/* Selected checkmark */}
              {isSelected && (
                <circle
                  cx={stall.x + stall.width - 15}
                  cy={stall.y + 15}
                  r="10"
                  fill="hsl(var(--bronze))"
                  pointerEvents="none"
                />
              )}
              {isSelected && (
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
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(450, 785)">
          <text className="fill-foreground font-semibold" fontSize="12" y="15">Legend:</text>
          
          <rect x="60" y="5" width="20" height="20" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" rx="2" />
          <text className="fill-foreground" fontSize="11" x="85" y="19">Available</text>
          
          <rect x="160" y="5" width="20" height="20" fill="hsl(var(--navy))" rx="2" />
          <text className="fill-foreground" fontSize="11" x="185" y="19">Selected</text>
          
          <rect x="260" y="5" width="20" height="20" fill="hsl(var(--muted))" opacity="0.5" rx="2" />
          <text className="fill-foreground" fontSize="11" x="285" y="19">Reserved</text>
        </g>
      </svg>
    </div>
  );
};
