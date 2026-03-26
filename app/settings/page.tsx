"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Smartphone,
  Key,
  LogOut,
  Trash2,
  Check,
} from "lucide-react";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    issueAssigned: true,
    issueUpdated: true,
    mentions: true,
    weeklyDigest: false,
  });

  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });
  const handleUpdatePassword = async () => {
    const currentPassword = (
      document.getElementById("currentPassword") as HTMLInputElement
    ).value;
    const newPassword = (
      document.getElementById("newPassword") as HTMLInputElement
    ).value;
    const confirmPassword = (
      document.getElementById("confirmPassword") as HTMLInputElement
    ).value;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/user/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      alert("Password updated successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error updating password");
    }
  };

  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("eat");
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);
  const handleSave = async () => {
    const formData = new FormData();
    formData.append(
      "firstName",
      (document.getElementById("firstName") as HTMLInputElement).value,
    );
    formData.append(
      "lastName",
      (document.getElementById("lastName") as HTMLInputElement).value,
    );
    formData.append(
      "email",
      (document.getElementById("email") as HTMLInputElement).value,
    );
    formData.append(
      "department",
      (document.getElementById("department") as HTMLInputElement).value,
    );

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      const res = await fetch("/api/user/update-profile", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Failed to update profile");

      setSaved(true);

      // Update preview with the uploaded image path from backend
      if (data.profileImagePath) setPreview(data.profileImagePath);

      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
    }
  };
  const [preview, setPreview] = useState<string | null>(null); // for profile image preview
  const [profileImage, setProfileImage] = useState<File | null>(null); // for uploading
  const [saved, setSaved] = useState(false); // for "Saved" button state

  // Example user data — replace with real data from your database/session
  const userData = {
    firstName: "Abebe",
    lastName: "Kebede",
    email: "abebe.kebede@ethiotelecom.et",
    department: "Network Infrastructure",
    role: "Senior Network Engineer",
  };

  const userInitials = `${userData.firstName[0]}${userData.lastName[0]}`;
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File is too big. Max 2MB.");
      return;
    }

    setProfileImage(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };
  const handlesSave = () => {
    localStorage.setItem("language", language);
    localStorage.setItem("timezone", timezone);

    setSaved(true);

    setTimeout(() => setSaved(false), 2000);
  };
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    const savedTz = localStorage.getItem("timezone");

    if (savedLang) setLanguage(savedLang);
    if (savedTz) setTimezone(savedTz);
  }, []);
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-4">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and profile picture
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Image */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    {preview ? (
                      <AvatarImage src={preview} alt="Profile" />
                    ) : (
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {userInitials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                      <input
                        id="profileUpload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("profileUpload")?.click()
                        }
                      >
                        Change Photo
                      </Button>

                      <p className="text-xs text-muted-foreground">
                        JPG, PNG or GIF. Max 2MB.
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG or GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Name Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue={userData.firstName} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue={userData.lastName} />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={userData.email}
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <div className="flex items-center gap-2">
                    <Input id="role" defaultValue={userData.role} disabled />
                    <Badge variant="secondary">Admin</Badge>
                  </div>
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" defaultValue={userData.department} />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleSave}>
                    {saved ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Saved
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how and when you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Notifications
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Email notifications</p>
                      <p className="text-xs text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, email: checked })
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Push Notifications
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Push notifications</p>
                      <p className="text-xs text-muted-foreground">
                        Receive push notifications on your device
                      </p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, push: checked })
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">
                    Activity Notifications
                  </h4>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        Issue assigned to me
                      </p>
                      <p className="text-xs text-muted-foreground">
                        When an issue is assigned to you
                      </p>
                    </div>
                    <Switch
                      checked={notifications.issueAssigned}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          issueAssigned: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Issue updates</p>
                      <p className="text-xs text-muted-foreground">
                        When issues you follow are updated
                      </p>
                    </div>
                    <Switch
                      checked={notifications.issueUpdated}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          issueUpdated: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Mentions</p>
                      <p className="text-xs text-muted-foreground">
                        When someone mentions you in a comment
                      </p>
                    </div>
                    <Switch
                      checked={notifications.mentions}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          mentions: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Weekly digest</p>
                      <p className="text-xs text-muted-foreground">
                        Receive a weekly summary of activity
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          weeklyDigest: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave}>
                    {saved ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Saved
                      </>
                    ) : (
                      "Save Preferences"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleUpdatePassword}>
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Two-factor authentication is disabled
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Protect your account with 2FA
                    </p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>
                  Manage devices where you are currently logged in
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Chrome on Windows</p>
                      <p className="text-xs text-muted-foreground">
                        Addis Ababa, Ethiopia - Current session
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">Current</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Mobile App on iPhone
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last active 2 hours ago
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible actions for your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Delete Account</p>
                    <p className="text-xs text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>
                  Choose how the application looks to you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 ${
                      theme === "light"
                        ? "border-primary"
                        : "border-muted hover:border-primary/50 transition-colors"
                    }`}
                  >
                    <div className="h-20 w-full rounded-md bg-background border" />
                    <span className="text-sm font-medium">Light</span>
                  </button>

                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 ${
                      theme === "dark"
                        ? "border-primary"
                        : "border-muted hover:border-primary/50 transition-colors"
                    }`}
                  >
                    <div className="h-20 w-full rounded-md bg-slate-900" />
                    <span className="text-sm font-medium">Dark</span>
                  </button>

                  <button
                    onClick={() =>
                      setTheme((prev) => (prev === "dark" ? "light" : "dark"))
                    }
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 ${
                      theme !== "light" && theme !== "dark"
                        ? "border-primary"
                        : "border-muted hover:border-primary/50 transition-colors"
                    }`}
                  >
                    <div className="h-20 w-full rounded-md bg-gradient-to-br from-background to-slate-900" />
                    <span className="text-sm font-medium">System</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Language & Region</CardTitle>
                <CardDescription>
                  Set your preferred language and regional settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="en">English</option>
                    <option value="am">Amharic</option>
                    <option value="fr">French</option>
                    <option value="sp">Spanish</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="eat">East Africa Time (EAT)</option>
                    <option value="utc">UTC</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handlesSave}>
                    {saved ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Saved
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
