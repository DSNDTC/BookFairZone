import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { BookOpen, ArrowLeft, Plus, X, BookMarked, Store, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const SUGGESTED_GENRES = [
  "Fiction",
  "Non-Fiction",
  "Biography",
  "Self-Help",
  "History",
  "Science",
  "Technology",
  "Philosophy",
  "Poetry",
  "Drama",
  "Children's Books",
  "Young Adult",
  "Mystery",
  "Thriller",
  "Romance",
  "Fantasy",
  "Science Fiction",
  "Horror",
  "Academic",
  "Religious",
  "Art & Design",
  "Cookbooks",
  "Travel",
  "Health & Wellness",
];

// Mock booked stalls data
const BOOKED_STALLS = [
  { id: "S-101", name: "Stall 101", section: "Main Hall A", bookingDate: "2024-01-15" },
  { id: "S-205", name: "Stall 205", section: "Main Hall B", bookingDate: "2024-01-18" },
  { id: "S-312", name: "Stall 312", section: "East Wing", bookingDate: "2024-01-20" },
];

const Genres = () => {
  const [selectedStall, setSelectedStall] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [customGenre, setCustomGenre] = useState("");

  const handleToggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleAddCustomGenre = () => {
    if (!customGenre.trim()) return;
    
    if (selectedGenres.includes(customGenre.trim())) {
      toast.error("This genre is already added");
      return;
    }

    setSelectedGenres([...selectedGenres, customGenre.trim()]);
    setCustomGenre("");
    toast.success(`Added "${customGenre.trim()}" to your genres`);
  };

  const handleSave = () => {
    if (!selectedStall) {
      toast.error("Please select a stall first");
      return;
    }
    if (selectedGenres.length === 0) {
      toast.error("Please select at least one genre");
      return;
    }
    const stallName = BOOKED_STALLS.find(s => s.id === selectedStall)?.name;
    toast.success(`Genres saved successfully for ${stallName}!`);
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
              <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-dark rounded-lg flex items-center justify-center">
                <BookMarked className="w-5 h-5 text-accent-foreground" />
              </div>
              <h1 className="font-serif text-xl font-bold text-foreground">Literary Genres</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 animate-fade-in">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
            Select Your Genres
          </h2>
          <p className="text-muted-foreground">
            First select your booked stall, then choose the literary genres you'll be displaying
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Genre Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booked Stalls Selection */}
            <Card className="p-6 border-border shadow-[var(--shadow-elegant)] animate-fade-in">
              <h3 className="font-serif text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Store className="w-5 h-5 text-navy" />
                Your Booked Stalls
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select which stall you want to configure genres for
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {BOOKED_STALLS.map((stall) => (
                  <button
                    key={stall.id}
                    onClick={() => setSelectedStall(stall.id)}
                    className={`relative p-4 rounded-lg border-2 transition-all duration-300 text-left hover:scale-105 ${
                      selectedStall === stall.id
                        ? "border-navy bg-navy/10 shadow-[var(--shadow-elegant)]"
                        : "border-border bg-card hover:border-navy/50"
                    }`}
                  >
                    {selectedStall === stall.id && (
                      <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-navy" />
                    )}
                    <div className="font-semibold text-foreground mb-1">{stall.name}</div>
                    <div className="text-sm text-muted-foreground mb-2">{stall.section}</div>
                    <div className="text-xs text-muted-foreground">
                      Booked: {new Date(stall.bookingDate).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
            <Card className="p-6 border-border shadow-[var(--shadow-elegant)] animate-fade-in">
              <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                Suggested Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleToggleGenre(genre)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      selectedGenres.includes(genre)
                        ? "bg-burgundy text-primary-foreground shadow-[var(--shadow-book)]"
                        : "bg-parchment text-foreground border border-border hover:border-burgundy"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-6 border-border shadow-[var(--shadow-elegant)] animate-fade-in" style={{ animationDelay: "100ms" }}>
              <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                Add Custom Genre
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Don't see your genre? Add a custom one below.
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter genre name..."
                  value={customGenre}
                  onChange={(e) => setCustomGenre(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCustomGenre()}
                  className="flex-1"
                />
                <Button variant="bronze" onClick={handleAddCustomGenre}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </Card>
          </div>

          {/* Summary Section */}
          <div>
            <Card className="p-6 border-border shadow-[var(--shadow-elegant)] animate-fade-in-scale sticky top-24">
              <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                Selected Genres
              </h3>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Total Selected</span>
                  <span className="text-2xl font-bold text-burgundy">{selectedGenres.length}</span>
                </div>

                {selectedGenres.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">No genres selected yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {selectedGenres.map((genre) => (
                      <div
                        key={genre}
                        className="flex items-center justify-between bg-parchment/50 p-3 rounded-lg group hover:bg-parchment transition-colors"
                      >
                        <span className="text-sm font-medium">{genre}</span>
                        <button
                          onClick={() => handleToggleGenre(genre)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/80"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4 p-3 bg-navy/5 rounded-lg border border-navy/20">
                <div className="text-xs text-muted-foreground mb-1">Selected Stall:</div>
                <div className="font-semibold text-foreground">
                  {selectedStall 
                    ? BOOKED_STALLS.find(s => s.id === selectedStall)?.name 
                    : "No stall selected"}
                </div>
              </div>

              <Button
                variant="elegant"
                size="lg"
                className="w-full"
                onClick={handleSave}
                disabled={!selectedStall || selectedGenres.length === 0}
              >
                Save Genres
              </Button>

              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <BookMarked className="w-4 h-4 text-burgundy" />
                  Why add genres?
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Adding genres helps visitors find your stall more easily. Your genres will be displayed in the exhibition catalog and digital map.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Genres;
