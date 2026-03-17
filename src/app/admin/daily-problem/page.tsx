"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/toaster";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Code2, 
  Plus, 
  Download, 
  TerminalSquare, 
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Users
} from "lucide-react";

export default function AdminDailyProblem() {
  const [activeTab, setActiveTab] = useState<"create" | "submissions">("create");
  const [formData, setFormData] = useState({
    title: "",
    statement: "",
    sample_input: "",
    sample_output: "",
    problem_date: new Date().toISOString().split("T")[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [problems, setProblems] = useState<any[]>([]);
  const [selectedProblemId, setSelectedProblemId] = useState<string>("");

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    if (selectedProblemId) {
      fetchSubmissions(selectedProblemId);
    }
  }, [selectedProblemId]);

  const fetchProblems = async () => {
    const { data } = await supabase
      .from('daily_problems')
      .select('*')
      .order('problem_date', { ascending: false });
    
    if (data) {
      setProblems(data);
      if (data.length > 0) setSelectedProblemId(data[0].id);
    }
  };

  const fetchSubmissions = async (problemId: string) => {
    const { data } = await supabase
      .from('problem_submissions')
      .select('*, profiles(full_name, username)')
      .eq('problem_id', problemId)
      .order('created_at', { ascending: false });
    
    if (data) setSubmissions(data);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase.from('daily_problems').insert([formData]);
    
    setIsSubmitting(false);
    if (!error) {
      toast("Problem Created Successfully!", "success");
      setFormData({
        title: "",
        statement: "",
        sample_input: "",
        sample_output: "",
        problem_date: new Date().toISOString().split("T")[0]
      });
      fetchProblems();
    } else {
      toast("Error creating problem.", "error");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 print:p-0 print:m-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 print:hidden">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 leading-none">
            Daily <span className="text-primary italic">Problem.</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-3">Manage coding challenges & submissions</p>
        </div>
        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab('create')}
            className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
              activeTab === 'create' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create New
          </button>
          <button 
            onClick={() => setActiveTab('submissions')}
            className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
              activeTab === 'submissions' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Submissions
          </button>
        </div>
      </div>

      {activeTab === 'create' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="print:hidden">
          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 sm:p-12 bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <TerminalSquare size={24} />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black">Issue New Challenge</CardTitle>
                  <CardDescription className="font-bold text-slate-500 uppercase tracking-widest text-xs mt-1">Configure Daily Problem constraints</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 sm:p-12">
              <form onSubmit={handleCreate} className="space-y-8 flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Problem Title</label>
                    <input 
                      type="text" 
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pb-4" 
                      placeholder="e.g. Reverse a String"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Date</label>
                    <input 
                      type="date" 
                      required
                      value={formData.problem_date}
                      onChange={(e) => setFormData({...formData, problem_date: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pb-4"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Problem Statement Statement</label>
                  <textarea 
                    required
                    value={formData.statement}
                    onChange={(e) => setFormData({...formData, statement: e.target.value})}
                    className="w-full min-h-[150px] bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                    placeholder="Write the full problem description here..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Sample Input</label>
                    <textarea 
                      required
                      value={formData.sample_input}
                      onChange={(e) => setFormData({...formData, sample_input: e.target.value})}
                      className="w-full min-h-[100px] font-mono text-xs bg-slate-900 text-slate-300 border border-slate-800 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                      placeholder="e.g. hello world"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Expected Output</label>
                    <textarea 
                      required
                      value={formData.sample_output}
                      onChange={(e) => setFormData({...formData, sample_output: e.target.value})}
                      className="w-full min-h-[100px] font-mono text-xs bg-slate-900 text-slate-300 border border-slate-800 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                      placeholder="e.g. dlrow olleh"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={isSubmitting} className="h-16 rounded-[2rem] px-12 font-black text-[12px] uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-white">
                    {isSubmitting ? 'Deploying...' : 'Publish Challenge'}
                    <Plus size={20} />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === 'submissions' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 print:hidden">
            <select 
              value={selectedProblemId}
              onChange={(e) => setSelectedProblemId(e.target.value)}
              className="w-full md:w-1/3 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
              {problems.map(p => (
                <option key={p.id} value={p.id}>[{p.problem_date}] {p.title}</option>
              ))}
            </select>
            <Button onClick={handlePrint} className="h-14 rounded-2xl px-8 font-black text-[10px] uppercase tracking-widest gap-3 bg-slate-900 text-white hover:bg-slate-800 transition-all">
              <Download size={16} />
              Export PDF
            </Button>
          </div>

          <div className="print-area">
            <div className="hidden print:block mb-8 border-b-2 border-slate-900 pb-4">
              <h2 className="text-3xl font-black uppercase text-slate-900 leading-none">Club Hub Report</h2>
              <p className="font-bold text-slate-500 uppercase tracking-widest text-xs mt-2">
                Problem: {problems.find(p => p.id === selectedProblemId)?.title || 'N/A'} | Date: {problems.find(p => p.id === selectedProblemId)?.problem_date || 'N/A'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {submissions.length === 0 ? (
                <div className="text-center p-20 border-2 border-dashed border-slate-200 rounded-[2.5rem] print:hidden">
                  <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">No Submissions yet</p>
                </div>
              ) : (
                submissions.map(sub => (
                  <Card key={sub.id} className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden print:shadow-none print:border print:border-slate-300 print:mb-8">
                    <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100 flex flex-row items-center justify-between print:bg-white print:border-slate-300">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-black text-slate-500 print:hidden">
                          {sub.profiles?.full_name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-black text-slate-900">{sub.profiles?.full_name || 'Unknown'}</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">@{sub.profiles?.username || 'user'} • {new Date(sub.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 items-center">
                        <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest rounded-full">{sub.language}</Badge>
                        {sub.status === 'Passed' ? (
                          <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 font-black text-[9px] uppercase tracking-widest rounded-full gap-1 flex items-center">
                            <CheckCircle2 size={12} /> Accepted
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 border border-red-200 font-black text-[9px] uppercase tracking-widest rounded-full gap-1 flex items-center">
                            <XCircle size={12} /> Failed
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <pre className="p-6 bg-slate-900 text-slate-300 font-mono text-xs overflow-x-auto print:bg-white print:text-black">
                        <code>{sub.code}</code>
                      </pre>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Basic print styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-area { width: 100%; display: block; }
          @page { size: landscape; margin: 1cm; }
        }
      `}} />
    </div>
  );
}
