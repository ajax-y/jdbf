"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Star, Loader2 } from "lucide-react";

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedEventId]);

  const fetchData = async () => {
    setIsLoading(true);
    
    // Fetch all events for filter
    const { data: eventsData } = await supabase
      .from('events')
      .select('id, title, date')
      .order('date', { ascending: false });
    
    if (eventsData) setEvents(eventsData);

    // Fetch feedback
    let query = supabase
      .from('event_feedback')
      .select('*, profiles(full_name, username), events(title, date)')
      .order('created_at', { ascending: false });

    if (selectedEventId !== "all") {
      query = query.eq('event_id', selectedEventId);
    }

    const { data: feedbackData } = await query;
    if (feedbackData) setFeedbacks(feedbackData);
    
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 leading-none">
            Event <span className="text-primary italic">Feedback.</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-3">Review club session metrics & member sentiment</p>
        </div>
        <select 
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="w-full sm:w-1/3 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
        >
          <option value="all">All Events</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>[{ev.date}] {ev.title}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="flex justify-center p-20">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center p-20 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
            <MessageSquare size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">No feedback found</p>
          </div>
        ) : (
          feedbacks.map((item) => (
            <Card key={item.id} className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.03)] rounded-3xl overflow-hidden border border-slate-100">
              <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-lg">
                    {item.profiles?.full_name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg">{item.profiles?.full_name || 'Member'} <span className="text-slate-400 font-medium text-xs">@{item.profiles?.username}</span></h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Event: {item.events?.title} • {new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                {item.rating && (
                  <Badge className="bg-amber-100 text-amber-700 border border-amber-200 font-black text-[10px] uppercase tracking-widest rounded-full gap-1 flex items-center w-fit px-3 py-1.5 shadow-sm">
                    {item.rating} <Star size={12} fill="currentColor" />
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="p-8">
                <p className="font-bold text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {item.feedback_text}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
