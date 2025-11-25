import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import authService from "@/services/auth.service";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Building,
  Lock,
  Mail,
  Phone,
  Save,
  Shield,
  User,
} from "lucide-react";

interface ProfileFormState {
  displayName: string;
  businessName: string;
  phoneNumber: string;
  website: string;
  bio: string;
}

interface PreferenceState {
  emailUpdates: boolean;
  smsAlerts: boolean;
  reservationReminders: boolean;
}

const defaultProfile: ProfileFormState = {
  displayName: "",
  businessName: "",
  phoneNumber: "",
  website: "",
  bio: "",
};

const defaultPreferences: PreferenceState = {
  emailUpdates: true,
  smsAlerts: false,
  reservationReminders: true,
};

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ userId: string; email: string; role: string } | null>(null);
  const [profileForm, setProfileForm] = useState<ProfileFormState>(defaultProfile);
  const [preferences, setPreferences] = useState<PreferenceState>(defaultPreferences);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const profileStorageKey = useMemo(() => (user ? `profile:${user.userId}` : null), [user]);
  const preferenceStorageKey = useMemo(() => (user ? `preferences:${user.userId}` : null), [user]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    if (!user) return;

    const storedProfile = profileStorageKey ? localStorage.getItem(profileStorageKey) : null;
    const storedPreferences = preferenceStorageKey ? localStorage.getItem(preferenceStorageKey) : null;

    if (storedProfile) {
      try {
        setProfileForm(JSON.parse(storedProfile));
      } catch {
        setProfileForm({
          ...defaultProfile,
          displayName: user.email?.split("@")[0] ?? "",
        });
      }
    } else {
      setProfileForm((prev) => ({
        ...prev,
        displayName: prev.displayName || user.email?.split("@")[0] || "",
      }));
    }

    if (storedPreferences) {
      try {
        setPreferences(JSON.parse(storedPreferences));
      } catch {
        setPreferences(defaultPreferences);
      }
    }
  }, [user, profileStorageKey, preferenceStorageKey]);

  const handleProfileChange = (field: keyof ProfileFormState, value: string) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePreferenceToggle = (field: keyof PreferenceState) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = () => {
    if (!user || !profileStorageKey || !preferenceStorageKey) return;

    setIsSaving(true);
    try {
      localStorage.setItem(profileStorageKey, JSON.stringify(profileForm));
      localStorage.setItem(preferenceStorageKey, JSON.stringify(preferences));
      toast.success("Profile preferences saved");
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Something went wrong while saving");
    } finally {
      setIsSaving(false);
    }
  };

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

  const formattedRole = user?.role?.replace(/_/g, " ") ?? "User";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-parchment to-background">
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40 backdrop-blur-sm bg-card/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gold to-burgundy rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-foreground">My Profile</h1>
                <p className="text-xs text-muted-foreground">{user?.email || "Publisher Portal"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoggingOut}>
                <Lock className="w-4 h-4 mr-2" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="animate-fade-in">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Account details</h2>
          <p className="text-muted-foreground max-w-2xl">
            Keep your profile up to date so event managers know who to reach out to when stall reservations change.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6 border-border shadow-[var(--shadow-elegant)] lg:col-span-1 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-burgundy/10 flex items-center justify-center text-2xl font-semibold text-burgundy">
                {profileForm.displayName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Display name</p>
                <p className="text-xl font-semibold text-foreground">{profileForm.displayName || "Unnamed user"}</p>
                <p className="text-sm text-muted-foreground capitalize">{formattedRole.toLowerCase()}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                {user?.email ?? "No email on file"}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                User ID: {user?.userId ?? "Pending"}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                Role: {formattedRole}
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border shadow-[var(--shadow-elegant)] lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Profile information</h3>
                <p className="text-sm text-muted-foreground">These details are only visible to BookFairZone staff.</p>
              </div>
              <Button variant="elegant" size="sm" onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display name</Label>
                <Input
                  id="displayName"
                  value={profileForm.displayName}
                  onChange={(e) => handleProfileChange("displayName", e.target.value)}
                  placeholder="Your publishing name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessName">Business / Imprint</Label>
                <Input
                  id="businessName"
                  value={profileForm.businessName}
                  onChange={(e) => handleProfileChange("businessName", e.target.value)}
                  placeholder="Ex: ABC Publishers"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone number</Label>
                <Input
                  id="phoneNumber"
                  value={profileForm.phoneNumber}
                  onChange={(e) => handleProfileChange("phoneNumber", e.target.value)}
                  placeholder="+94 71 234 5678"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website / Marketplace</Label>
                <Input
                  id="website"
                  value={profileForm.website}
                  onChange={(e) => handleProfileChange("website", e.target.value)}
                  placeholder="https://yourstore.lk"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Short bio or notes</Label>
              <Textarea
                id="bio"
                rows={4}
                value={profileForm.bio}
                onChange={(e) => handleProfileChange("bio", e.target.value)}
                placeholder="Tell us about your publishing focus, genres, or logistics preferences..."
              />
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6 border-border shadow-[var(--shadow-elegant)] space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Communication preferences</h3>
                <p className="text-sm text-muted-foreground">Decide how we should reach you for fair updates.</p>
              </div>
              <Bell className="w-5 h-5 text-burgundy" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Email updates</p>
                  <p className="text-sm text-muted-foreground">Confirmations, invoices, and schedule changes.</p>
                </div>
                <Switch
                  checked={preferences.emailUpdates}
                  onCheckedChange={() => handlePreferenceToggle("emailUpdates")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">SMS alerts</p>
                  <p className="text-sm text-muted-foreground">Urgent fair announcements for stall owners.</p>
                </div>
                <Switch
                  checked={preferences.smsAlerts}
                  onCheckedChange={() => handlePreferenceToggle("smsAlerts")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Reservation reminders</p>
                  <p className="text-sm text-muted-foreground">Get nudges before payment or setup deadlines.</p>
                </div>
                <Switch
                  checked={preferences.reservationReminders}
                  onCheckedChange={() => handlePreferenceToggle("reservationReminders")}
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                Phone: {profileForm.phoneNumber || "Not set"}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Building className="w-4 h-4" />
                Business: {profileForm.businessName || "Not set"}
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border shadow-[var(--shadow-elegant)] space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Account security</h3>
                <p className="text-sm text-muted-foreground">Protect your account with best practices.</p>
              </div>
              <Shield className="w-5 h-5 text-gold" />
            </div>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                We recommend updating your password regularly and enabling MFA when it becomes available. Keep your contact
                details current so we can verify ownership quickly.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/forgot-password">
                  <Button variant="outline" size="sm">
                    <Lock className="w-4 h-4 mr-2" />
                    Update password
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  Save preferences
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;

