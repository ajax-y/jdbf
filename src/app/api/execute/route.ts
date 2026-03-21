import { NextRequest, NextResponse } from "next/server";

const PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.language || !body.version || !body.files) {
      return NextResponse.json(
        { message: "Missing required fields: language, version, files" },
        { status: 400 }
      );
    }

    const response = await fetch(PISTON_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: body.language,
        version: body.version,
        files: body.files,
        stdin: body.stdin || "",
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: `Execution engine returned status ${response.status}` },
        { status: 502 }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Code execution proxy error:", error);
    return NextResponse.json(
      { message: "Failed to connect to execution engine. It may be temporarily unavailable." },
      { status: 502 }
    );
  }
}
