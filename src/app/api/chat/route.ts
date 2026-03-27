import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          content: [
            {
              type: "text",
              text: "⚠️ No API key configured. Add ANTHROPIC_API_KEY to your .env.local file to enable AI responses. For now, the interface is fully functional — you can explore all tabs, build JSON prompts, and browse the architecture cards.",
            },
          ],
        },
        { status: 200 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: body.model || "claude-sonnet-4-20250514",
        max_tokens: body.max_tokens || 1000,
        system: body.system || "",
        messages: body.messages || [],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          content: [
            {
              type: "text",
              text: `API Error (${response.status}): ${errorText}`,
            },
          ],
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        content: [
          {
            type: "text",
            text: `Connection error: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
      },
      { status: 200 }
    );
  }
}
