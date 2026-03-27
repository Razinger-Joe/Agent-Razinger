import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const clientKey = req.headers.get("x-custom-api-key");
    const apiKey = clientKey || process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          content: [
            {
              type: "text",
              text: "⚠️ No API key configured. Click the gear icon in the chat context bar to add your own Anthropic key, or add ANTHROPIC_API_KEY to the .env.local file.",
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
