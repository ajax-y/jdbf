"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Github,
  Heart,
  MessageSquare,
  Share2,
  ExternalLink,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const projects = [
  {
    id: 1,
    title: "EcoTrack AI",
    description: "Successfully implemented a machine learning model to track carbon footprints in real-time. Features include predictive analysis and smart recommendations.",
    author: { name: "Sarah Chen", avatar: "", role: "Gold Member" },
    likes: 42,
    comments: 12,
    tags: ["Machine Learning", "Python", "React"],
    githubUrl: "https://github.com",
  },
  {
    id: 2,
    title: "GfG App Redesign",
    description: "A complete overhaul of the club's mobile interface focused on a 'Cyber' aesthetic and better UX for event registration.",
    author: { name: "Alex Rivera", avatar: "", role: "Silver Member" },
    likes: 28,
    comments: 5,
    tags: ["UI/UX", "Figma", "Next.js"],
    githubUrl: "https://github.com",
  },
  {
    id: 3,
    title: "Blockchain Voting System",
    description: "Decentralized voting mechanism for campus elections using Ethereum smart contracts to ensure transparency and security.",
    author: { name: "John Doe", avatar: "", role: "Gold Member" },
    likes: 156,
    comments: 34,
    tags: ["Blockchain", "Solidity", "Tailwind"],
    githubUrl: "https://github.com",
  },
];

export default function ProjectGalleryPage() {
  const [liked, setLiked] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-border/10">
        <div>
          <h1 className="text-5xl font-black tracking-tighter">
            Project <span className="text-primary">Gallery.</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Showcase your work and get inspired by the community.
          </p>
        </div>
        <Button className="rounded-2xl h-14 px-8 font-black text-xs uppercase tracking-widest gap-3 shadow-xl shadow-primary/20">
          <Plus size={18} />
          Submit Project
        </Button>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="break-inside-avoid"
          >
            <Card className="border-none shadow-xl bg-card hover:-translate-y-2 transition-all duration-300 overflow-hidden group">
              <div className="h-48 w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
                 <div className="absolute inset-4 border border-primary/10 rounded-xl" />
                 <CustomCode size={48} className="text-primary/20 group-hover:scale-110 transition-transform duration-500" />
                 <div className="absolute top-4 right-4 flex gap-2">
                    {project.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-background/80 backdrop-blur-sm border-none font-bold text-[10px] uppercase">
                        {tag}
                      </Badge>
                    ))}
                 </div>
              </div>
              
              <CardHeader className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                    <AvatarFallback className="font-bold bg-primary/10 text-primary">
                      {project.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-sm leading-tight">{project.author.name}</h4>
                    <p className="text-[10px] uppercase tracking-widest font-black text-primary/70">
                      {project.author.role}
                    </p>
                  </div>
                </div>
                <CardTitle className="text-2xl font-black mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 font-medium">
                  {project.description}
                </p>
              </CardHeader>

              <CardContent className="p-6 pt-0 border-b border-border/5">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => toggleLike(project.id)}
                    className="flex items-center gap-2 group/btn"
                  >
                    <Heart className={`h-5 w-5 transition-colors ${liked.includes(project.id) ? "fill-red-500 text-red-500" : "text-muted-foreground group-hover/btn:text-red-500"}`} />
                    <span className="text-xs font-bold">{project.likes + (liked.includes(project.id) ? 1 : 0)}</span>
                  </button>
                  <button className="flex items-center gap-2 group/btn">
                    <MessageSquare className="h-5 w-5 text-muted-foreground group-hover/btn:text-primary transition-colors" />
                    <span className="text-xs font-bold">{project.comments}</span>
                  </button>
                  <button className="ml-auto group/btn">
                    <Share2 className="h-5 w-5 text-muted-foreground group-hover/btn:text-primary transition-colors" />
                  </button>
                </div>
              </CardContent>

              <CardFooter className="p-6 flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl h-11 font-bold text-xs uppercase tracking-widest gap-2 opacity-50 hover:opacity-100">
                  <ExternalLink size={14} />
                  Demo
                </Button>
                <Link 
                  href={project.githubUrl} 
                  target="_blank"
                  className={cn(
                    buttonVariants(),
                    "flex-1 rounded-xl h-11 font-black text-xs uppercase tracking-widest gap-2 shadow-lg shadow-primary/10"
                  )}
                >
                  <Github size={14} />
                  Source
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CustomCode(props: any) {
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
