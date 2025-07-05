import { NextRequest, NextResponse } from "next/server";
import { env } from "~/env";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${env.ENDPOINT}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": env.KEY,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Upstream error" }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
