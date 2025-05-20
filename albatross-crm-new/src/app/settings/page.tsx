import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 h-auto">
          <TabsTrigger 
            value="account" 
            className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Account
          </TabsTrigger>
          <TabsTrigger 
            value="preferences" 
            className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Preferences
          </TabsTrigger>
          <TabsTrigger 
            value="integrations" 
            className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Integrations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Account Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" className="mt-2" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john@example.com" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" className="mt-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  Leave blank to keep current password
                </p>
              </div>
              <div className="pt-4">
                <Button>Save Changes</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Application Preferences</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Theme</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <input type="radio" name="theme" value="light" className="h-4 w-4" defaultChecked />
                    <div>
                      <p>Light</p>
                      <p className="text-sm text-muted-foreground">Bright interface</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <input type="radio" name="theme" value="dark" className="h-4 w-4" />
                    <div>
                      <p>Dark</p>
                      <p className="text-sm text-muted-foreground">Easier on the eyes</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <input type="radio" name="theme" value="system" className="h-4 w-4" />
                    <div>
                      <p>System</p>
                      <p className="text-sm text-muted-foreground">Match your OS</p>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p>Email notifications</p>
                      <p className="text-sm text-muted-foreground">Important account updates</p>
                    </div>
                    <input type="checkbox" className="h-5 w-5" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p>Desktop notifications</p>
                      <p className="text-sm text-muted-foreground">New lead alerts</p>
                    </div>
                    <input type="checkbox" className="h-5 w-5" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button>Update Preferences</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Connected Apps</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Google Calendar</p>
                    <p className="text-sm text-muted-foreground">Sync your meetings</p>
                  </div>
                </div>
                <Button variant="outline">Manage</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Slack</p>
                    <p className="text-sm text-muted-foreground">Get notifications</p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
              
              <div className="pt-4">
                <Button variant="secondary">
                  View all integrations
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}