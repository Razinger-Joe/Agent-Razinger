import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const clientKey = req.headers.get("x-custom-api-key");
    const apiKey = clientKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          content: [
            {
              type: "text",
              text: "⚠️ No API key configured. Click the gear icon in the chat context bar to add your own Google Gemini key, or add GEMINI_API_KEY to the .env.local file.",
            },
          ],
        },
        { status: 200 }
      );
    }

    const geminiMessages = (body.messages || []).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: body.system ? {
          parts: [{ text: body.system }]
        } : undefined,
        contents: geminiMessages,
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
    return NextResponse.json({
      content: [
        {
          type: "text",
          text: data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated."
        }
      ]
    });
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
