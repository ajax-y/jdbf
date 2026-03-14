"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, Shield, Bell, Github, Mail, Edit3, Camera } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex flex-col items-center md:items-start md:flex-row gap-12 mb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <Avatar className="h-48 w-48 border-[6px] border-primary/10 transition-all duration-500 group-hover:border-primary/30">
            <AvatarFallback className="text-6xl font-black bg-primary/5 text-primary">JD</AvatarFallback>
          </Avatar>
          <button className="absolute bottom-2 right-2 p-4 bg-primary text-primary-foreground rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all">
             <Camera size={24} />
          </button>
        </motion.div>
        
        <div className="flex-1 text-center md:text-left pt-4">
           <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <h1 className="text-6xl font-black tracking-tighter">John <span className="text-primary">Doe.</span></h1>
              <Badge className="bg-amber-500 border-none font-black px-4 py-1 uppercase tracking-widest text-[10px]">Gold Member</Badge>
           </div>
           <p className="text-xl text-muted-foreground font-medium mb-8 max-w-lg">
             Full-stack developer passionate about building scalable solutions for campus communities.
           </p>
           <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Button variant="outline" className="rounded-xl font-bold h-12 gap-2 opacity-60 hover:opacity-100">
                 <Github size={18} />
                 GitHub
              </Button>
              <Button variant="outline" className="rounded-xl font-bold h-12 gap-2 opacity-60 hover:opacity-100">
                 <Mail size={18} />
                 Contact
              </Button>
              <Button className="rounded-xl font-black h-12 gap-2 shadow-lg shadow-primary/20">
                 <Edit3 size={18} />
                 Edit Bio
              </Button>
           </div>
        </div>
      </div>

      <Tabs defaultValue="account" className="space-y-8">
        <TabsList className="bg-muted/30 p-1 rounded-2xl h-14 w-full md:w-auto grid grid-cols-3 md:inline-flex">
          <TabsTrigger value="account" className="rounded-xl font-bold text-xs uppercase tracking-widest px-8 data-[state=active]:bg-background data-[state=active]:shadow-sm">
             <User size={14} className="mr-2" />
             Profile
          </TabsTrigger>
          <TabsTrigger value="projects" className="rounded-xl font-bold text-xs uppercase tracking-widest px-8 data-[state=active]:bg-background data-[state=active]:shadow-sm">
             <Settings size={14} className="mr-2" />
             Settings
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl font-bold text-xs uppercase tracking-widest px-8 data-[state=active]:bg-background data-[state=active]:shadow-sm">
             <Shield size={14} className="mr-2" />
             Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
           <Card className="border-none shadow-xl bg-card rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-10 border-b border-border/5">
                 <CardTitle className="text-2xl font-black tracking-tight">Public Information</CardTitle>
                 <CardDescription>Visible to all club members</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <Label className="text-xs font-black uppercase tracking-widest opacity-60">Full Name</Label>
                       <Input defaultValue="John Doe" className="h-14 rounded-2xl border-none bg-muted/30 font-bold px-6 focus-visible:ring-primary/40" />
                    </div>
                    <div className="space-y-3">
                       <Label className="text-xs font-black uppercase tracking-widest opacity-60">University Role</Label>
                       <Input defaultValue="3rd Year CSE" className="h-14 rounded-2xl border-none bg-muted/30 font-bold px-6 focus-visible:ring-primary/40" />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest opacity-60">Headline</Label>
                    <Input defaultValue="Building the future of RIT." className="h-14 rounded-2xl border-none bg-muted/30 font-bold px-6 focus-visible:ring-primary/40" />
                 </div>
                 <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest opacity-60">Core Expertise</Label>
                    <div className="flex flex-wrap gap-2 pt-2">
                       {['Next.js', 'Typescript', 'Deep Learning', 'UI Design'].map(tag => (
                          <Badge key={tag} className="bg-primary/5 text-primary border-none font-bold py-2 px-4 rounded-xl">
                             {tag}
                          </Badge>
                       ))}
                       <Button variant="ghost" className="rounded-xl h-10 border border-dashed border-primary/20 text-primary font-bold text-xs">
                          + Add Skill
                       </Button>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="projects">
           <Card className="border-none shadow-xl bg-card rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-10 border-b border-border/5">
                 <CardTitle className="text-2xl font-black tracking-tight">My Projects</CardTitle>
                 <CardDescription>Manage your showcase items</CardDescription>
              </CardHeader>
              <CardContent className="p-10 text-center py-20 opacity-30">
                 <Code size={48} className="mx-auto mb-4" />
                 <p className="font-bold">Project management tools coming soon</p>
              </CardContent>
           </Card>
        </TabsContent>
        
        <TabsContent value="security">
           <Card className="border-none shadow-xl bg-card rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-10 border-b border-border/5">
                 <CardTitle className="text-2xl font-black tracking-tight">Access Control</CardTitle>
                 <CardDescription>Secure your club profile</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-6">
                 <div className="flex items-center justify-between p-6 rounded-2xl bg-muted/20 border border-border/10">
                    <div className="flex items-center gap-4">
                       <Shield className="text-primary" />
                       <div>
                          <p className="font-black text-sm uppercase tracking-tight">Two-Factor Auth</p>
                          <p className="text-xs text-muted-foreground font-medium">Extra layer of security for your account</p>
                       </div>
                    </div>
                    <Button variant="outline" className="rounded-xl font-bold text-xs uppercase tracking-widest">Enable</Button>
                 </div>
                 <div className="flex items-center justify-between p-6 rounded-2xl bg-muted/20 border border-border/10">
                    <div className="flex items-center gap-4">
                       <Bell className="text-primary" />
                       <div>
                          <p className="font-black text-sm uppercase tracking-tight">Notifications</p>
                          <p className="text-xs text-muted-foreground font-medium">Get alerted for new events and projects</p>
                       </div>
                    </div>
                    <Button variant="outline" className="rounded-xl font-bold text-xs uppercase tracking-widest">Configure</Button>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Badge({ children, className }: any) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary text-primary-foreground transition-colors ${className}`}>
      {children}
    </span>
  );
}

function Code(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
