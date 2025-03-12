import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Lock, User, CreditCard, LogOut } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [bio, setBio] = useState(
    "Pet lover and proud owner of Max, a golden retriever. Always looking for reliable pet sitters when I travel for work."
  );
  const [location, setLocation] = useState("New York, NY");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    bookingReminders: true,
    messageNotifications: true,
    promotions: false,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save the profile data to the server
    alert("Profile saved successfully!");
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save the notification settings to the server
    alert("Notification settings saved successfully!");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send the password change request to the server
    alert("Password changed successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Payment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src="/placeholder.svg?height=150&width=150"
                          alt="Profile"
                        />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <Button variant="outline" size="sm" className="mb-2">
                          Change Avatar
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          JPG, GIF or PNG. Max size 2MB.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                      />
                      <p className="text-xs text-muted-foreground">
                        Brief description for your profile. URLs are
                        hyperlinked.
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleSaveNotifications}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Notification Channels
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="email-notifications">
                              Email Notifications
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications via email
                            </p>
                          </div>
                          <Switch
                            id="email-notifications"
                            checked={notifications.email}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                email: checked,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="push-notifications">
                              Push Notifications
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications on your device
                            </p>
                          </div>
                          <Switch
                            id="push-notifications"
                            checked={notifications.push}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                push: checked,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="sms-notifications">
                              SMS Notifications
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications via text message
                            </p>
                          </div>
                          <Switch
                            id="sms-notifications"
                            checked={notifications.sms}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                sms: checked,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Notification Types
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="booking-reminders">
                              Booking Reminders
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified about upcoming bookings
                            </p>
                          </div>
                          <Switch
                            id="booking-reminders"
                            checked={notifications.bookingReminders}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                bookingReminders: checked,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="message-notifications">
                              Message Notifications
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified when you receive new messages
                            </p>
                          </div>
                          <Switch
                            id="message-notifications"
                            checked={notifications.messageNotifications}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                messageNotifications: checked,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="promotions">
                              Promotions and Updates
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified about new features and special offers
                            </p>
                          </div>
                          <Switch
                            id="promotions"
                            checked={notifications.promotions}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                promotions: checked,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit">Save Preferences</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Change Password</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">
                            Current Password
                          </Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">
                            Confirm New Password
                          </Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Two-Factor Authentication
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Button variant="outline">Enable</Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Sessions</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          You're currently signed in on this device. Sign out of
                          all devices if you think your account has been
                          compromised.
                        </p>
                        <Button variant="outline" className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out of all devices
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit">Update Password</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Manage your payment information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Saved Payment Methods
                      </h3>
                      <div className="border rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-gray-100 p-2 rounded-md mr-4">
                            <CreditCard className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-medium">Visa ending in 4242</p>
                            <p className="text-sm text-muted-foreground">
                              Expires 12/2025
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex">
                      <Button variant="outline">Add Payment Method</Button>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Billing Address</h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input id="address" placeholder="123 Main St" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" placeholder="New York" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input id="state" placeholder="NY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">ZIP Code</Label>
                          <Input id="zip" placeholder="10001" />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button>Save Address</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
