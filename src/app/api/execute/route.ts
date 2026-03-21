import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.language || !body.files || body.files.length === 0) {
      return NextResponse.json(
        { message: "Missing required fields: language, files" },
        { status: 400 }
      );
    }

    const { language, files, stdin } = body;
    const code = files[0].content;

    // Map the languages from our frontend array to Wandbox compilers
    let wandboxCompiler = "";
    switch (language) {
      case "python":
        wandboxCompiler = "cpython-head";
        break;
      case "c":
        wandboxCompiler = "gcc-head-c";
        break;
      case "cpp":
        wandboxCompiler = "gcc-head";
        break;
      case "java":
        wandboxCompiler = "openjdk-head";
        break;
      case "go":
        wandboxCompiler = "go-head";
        break;
      default:
        // Fallback for unsupported languages 
        return NextResponse.json(
          { message: `Unsupported language: ${language}` },
          { status: 400 }
        );
    }

    // Call Wandbox API
    const response = await fetch("https://wandbox.org/api/compile.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        compiler: wandboxCompiler,
        code: code,
        stdin: stdin || "",
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: `Execution engine returned status ${response.status}` },
        { status: 502 }
      );
    }

    const wandboxResult = await response.json();

    /* 
      Wandbox response shape:
      {
        "status": "0",
        "program_message": "...",
        "program_output": "...", // usually the stdout
        "compiler_message": "...", 
        "compiler_error": "..."
      }
      
      We translate it to matching Piston response shape.
      The frontend uses: 
      - result.compile.code (non-0 for compile error)
      - result.compile.output
      - result.compile.stderr
      - result.run.code (non-0 for run error)
      - result.run.output
      - result.run.stderr
    */

    const status = parseInt(wandboxResult.status, 10);
    
    // Check if it's a compiler error vs runtime message
    const isCompileError = status !== 0 && wandboxResult.compiler_error;
    
    const result = {
      compile: isCompileError ? {
        code: status,
        output: wandboxResult.compiler_error || wandboxResult.compiler_message || "Compile Error",
        stderr: wandboxResult.compiler_error
      } : { code: 0 },
      run: !isCompileError ? {
        code: status,
        output: wandboxResult.program_output || wandboxResult.program_message || "",
        stderr: status !== 0 ? (wandboxResult.program_message || "Runtime Error") : ""
      } : undefined
    };

    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error("Code execution proxy error:", error);
    return NextResponse.json(
      { message: "Failed to connect to execution engine. It may be temporarily unavailable." },
      { status: 502 }
    );
  }
}
