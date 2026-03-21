"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TerminalSquare, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Trophy,
  Send
} from "lucide-react";
import Link from "next/link";
import Editor from "@monaco-editor/react";

const PISTON_API_URL = "/api/execute";

const LANGUAGES = [
  { id: "python", name: "Python", version: "3.10.0", defaultCode: "# Write your code here\nprint(input())" },
  { id: "c", name: "C", version: "10.2.0", defaultCode: "#include <stdio.h>\nint main() {\n    char s[100];\n    scanf(\"%s\", s);\n    printf(\"%s\\n\", s);\n    return 0;\n}" },
  { id: "cpp", name: "C++", version: "10.2.0", defaultCode: "#include <iostream>\nusing namespace std;\nint main() {\n    string s;\n    cin >> s;\n    cout << s << endl;\n    return 0;\n}" },
  { id: "java", name: "Java", version: "15.0.2", defaultCode: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNext()) System.out.println(sc.next());\n    }\n}" },
  { id: "go", name: "Go", version: "1.16.2", defaultCode: "package main\nimport \"fmt\"\nfunc main() {\n    var s string\n    fmt.Scan(&s)\n    fmt.Println(s)\n}" }
];

export default function UserDailyProblem() {
  const [problem, setProblem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(language.defaultCode);
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState<{status: string, output: string, error?: string} | null>(null);
  
  const [hasSolved, setHasSolved] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<{id: string, role: string} | null>(null);

  useEffect(() => {
    const session = document.cookie.split("; ").find(row => row.startsWith("gfg_session="))?.split("=")[1];
    const role = document.cookie.split("; ").find(row => row.startsWith("gfg_role="))?.split("=")[1];
    if (session) {
      setSessionInfo({ id: session, role: role || 'user' });
    }

    fetchTodayProblem(session);
  }, []);

  const fetchTodayProblem = async (userId?: string) => {
    setIsLoading(true);
    // Get today's date in YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];
    
    // Refresh at 8 AM logic: if current time is before 8 AM, use yesterday's date
    const now = new Date();
    if (now.getHours() < 8) {
      now.setDate(now.getDate() - 1);
    }
    const effectiveDate = now.toISOString().split("T")[0];

    const { data } = await supabase
      .from('daily_problems')
      .select('*')
      .eq('problem_date', effectiveDate)
      .single();
    
    if (data) {
      setProblem(data);
      if (userId) {
        // Check if user already solved it
        const { data: subData } = await supabase
          .from('problem_submissions')
          .select('id, status')
          .eq('problem_id', data.id)
          .eq('user_id', userId)
          .eq('status', 'Passed')
          .limit(1);
        if (subData && subData.length > 0) {
          setHasSolved(true);
        }
      }
    }
    setIsLoading(false);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = LANGUAGES.find(l => l.id === e.target.value);
    if (selected) {
      setLanguage(selected);
      setCode(selected.defaultCode);
    }
  };

  // Helper: call the Piston API and return parsed result
  const callExecutionAPI = async () => {
    const response = await fetch(PISTON_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: language.id,
        version: language.version,
        files: [{ name: "main", content: code }],
        stdin: problem.sample_input
      })
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new Error(errorBody?.message || `Execution engine returned status ${response.status}`);
    }

    return await response.json();
  };

  // Helper: parse Piston result into status + output (without comparing expected output)
  const parseResult = (result: any): { status: string; output: string } => {
    if (result.compile && result.compile.code !== 0) {
      return { status: "Compilation Error", output: result.compile.output || result.compile.stderr || "Compilation failed." };
    }
    if (!result.run) {
      return { status: "Error", output: "Unexpected response from execution engine." };
    }
    if (result.run.code !== 0) {
      return { status: "Runtime Error", output: result.run.stderr || result.run.output || "Runtime error occurred." };
    }
    return { status: "Success", output: result.run.output || "" };
  };

  // RUN: just execute and show the output — no DB write, no comparison
  const runCode = async () => {
    if (!problem) return;

    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const result = await callExecutionAPI();
      const parsed = parseResult(result);

      setExecutionResult({
        status: parsed.status === "Success" ? "Output" : parsed.status,
        output: parsed.output
      });
    } catch (err: any) {
      setExecutionResult({
        status: "Error",
        output: err.message || "Failed to connect to execution engine. Please try again later."
      });
    }

    setIsExecuting(false);
  };

  // SUBMIT: execute, compare against expected output, save to DB, award points
  const submitCode = async () => {
    if (!problem || !sessionInfo) return;

    setIsSubmitting(true);
    setExecutionResult(null);

    try {
      const result = await callExecutionAPI();
      const parsed = parseResult(result);

      let finalStatus = parsed.status;
      let outputText = parsed.output;

      // Only compare output if execution succeeded
      if (parsed.status === "Success") {
        const cleanActual = outputText.trim().replace(/\r\n/g, '\n');
        const cleanExpected = (problem.sample_output || "").trim().replace(/\r\n/g, '\n');

        if (cleanActual === cleanExpected) {
          finalStatus = "Passed";
          setHasSolved(true);
        } else {
          finalStatus = "Failed";
        }
      }

      setExecutionResult({ status: finalStatus, output: outputText });

      // Insert submission to DB
      await supabase.from('problem_submissions').insert([{
        problem_id: problem.id,
        user_id: sessionInfo.id,
        code: code,
        language: language.name,
        status: finalStatus
      }]);

      if (finalStatus === "Passed" && !hasSolved) {
        const { data: profile } = await supabase.from('profiles').select('points').eq('id', sessionInfo.id).single();
        if (profile) {
          await supabase.from('profiles').update({ points: (profile.points || 0) + 10 }).eq('id', sessionInfo.id);
        }
      }

    } catch (err: any) {
      setExecutionResult({
        status: "Error",
        output: err.message || "Failed to connect to execution engine. Please try again later."
      });
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center h-[70vh] text-center space-y-6">
        <div className="h-32 w-32 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
          <Trophy size={48} className="text-slate-300" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">No Challenge Today</h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">The admins haven't posted a daily problem yet. Check back later.</p>
        <Link href="/dashboard">
          <Button className="mt-4 h-14 rounded-2xl px-8 font-black text-[10px] uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 transition-all">
            Return to Base
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-20 h-full flex flex-col lg:flex-row gap-8">
      {/* LEFT PANEL: Problem Details */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="overflow-hidden">
          <Badge className="bg-primary/10 text-primary border border-primary/20 font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">Daily Challenge</Badge>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 leading-none">
            {problem.title}
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-4">Ends tomorrow at 08:00 AM</p>
        </div>

        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.03)] rounded-[2.5rem] bg-white flex-1 relative overflow-hidden">
          <CardContent className="p-8 sm:p-10 space-y-8 relative z-10">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Problem Statement</h3>
              <p className="font-bold text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {problem.statement}
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sample Input</h3>
              <pre className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-mono text-slate-900 overflow-x-auto shadow-inner">
                {problem.sample_input}
              </pre>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expected Output</h3>
              <pre className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-mono text-slate-900 overflow-x-auto shadow-inner">
                {problem.sample_output}
              </pre>
            </div>
          </CardContent>
          <div className="absolute bottom-0 right-0 p-12 opacity-[0.02] pointer-events-none translate-x-1/4 translate-y-1/4">
            <Trophy size={400} />
          </div>
        </Card>
      </div>

      {/* RIGHT PANEL: Code Editor & Execution */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        <Card className="border-none shadow-[0_30px_80px_rgba(0,0,0,0.04)] rounded-[2.5rem] bg-slate-900 flex flex-col flex-1 h-[70vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 bg-black/20">
            <div className="flex items-center gap-4">
              <TerminalSquare size={20} className="text-slate-400" />
              <select 
                value={language.id}
                onChange={handleLanguageChange}
                disabled={isExecuting || hasSolved}
                className="bg-transparent text-white font-black text-xs uppercase tracking-widest focus:outline-none disabled:opacity-50"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.id} value={lang.id} className="bg-slate-900 uppercase">{lang.name}</option>
                ))}
              </select>
            </div>
            {hasSolved && (
               <Badge className="bg-emerald-500/20 text-emerald-400 border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full flex gap-2 items-center">
                  <CheckCircle2 size={14} /> Solved
               </Badge>
            )}
          </div>
          
          <div className="flex-1 relative w-full h-[calc(100%-140px)] min-h-[300px]">
            {(isExecuting || isSubmitting || hasSolved) && (
              <div className="absolute inset-0 z-20 bg-slate-900/50 cursor-not-allowed" />
            )}
            <Editor
              height="100%"
              language={language.id === "c" || language.id === "cpp" ? "cpp" : language.id}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                fontFamily: "monospace",
                lineHeight: 1.6,
                padding: { top: 24 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                readOnly: isExecuting || isSubmitting || hasSolved
              }}
              className="absolute inset-0 w-full h-full"
            />
          </div>

          <div className="p-6 border-t border-white/10 bg-black/20 flex flex-col gap-6">
            {executionResult && (
              <div className={`p-6 rounded-2xl border ${
                executionResult.status === 'Passed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  {executionResult.status === 'Passed' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  <h4 className="font-black text-xs uppercase tracking-widest leading-none">{executionResult.status}</h4>
                </div>
                <pre className="font-mono text-xs overflow-x-auto opacity-80 mt-2">
                  {executionResult.output || '<No Output>'}
                </pre>
              </div>
            )}
            
            <div className="flex justify-end gap-3">
              <Button 
                onClick={runCode}
                disabled={isExecuting || isSubmitting || hasSolved}
                className={`h-16 rounded-[2rem] px-8 font-black text-[12px] uppercase tracking-widest gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all
                  ${hasSolved ? 'bg-slate-800 text-slate-500 shadow-none' : 'bg-slate-700 text-white hover:bg-slate-600 shadow-slate-900/20'}
                `}
              >
                {isExecuting ? (
                  <>Running <Loader2 className="animate-spin" size={20} /></>
                ) : (
                  <>Run Code <Play size={20} /></>
                )}
              </Button>
              <Button 
                onClick={submitCode}
                disabled={isExecuting || isSubmitting || hasSolved}
                className={`h-16 rounded-[2rem] px-8 font-black text-[12px] uppercase tracking-widest gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all
                  ${hasSolved ? 'bg-slate-800 text-slate-500 shadow-none' : 'bg-primary text-white shadow-primary/20'}
                `}
              >
                {isSubmitting ? (
                  <>Submitting <Loader2 className="animate-spin" size={20} /></>
                ) : hasSolved ? (
                  <>Challenge Complete <CheckCircle2 size={20} /></>
                ) : (
                  <>Submit <Send size={20} /></>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
