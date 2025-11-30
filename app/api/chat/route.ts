import { ragAgent } from "@/lib/agent";
import { run } from '@openai/agents';
import { NextResponse } from "next/server";

export const maxDuration = 60;
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { query } = body;

        if (!query) {
            return NextResponse.json(
                { error: "query is required" },
                { status: 400 }
            );
        }

        // Note: We pass the storeId in the user message context so the agent knows it.
        // Alternatively, we could pass it as a separate input if the agent logic supported it,
        // but appending it to the message is a robust way to ensure it's in context.
                        const userMessage = query;

        const result = await run(ragAgent, userMessage);

        return NextResponse.json({ answer: result.finalOutput });
    } catch (error) {
        console.error("Agent Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
