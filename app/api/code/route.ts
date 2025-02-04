import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

const openai = new OpenAI ({
    apiKey: process.env.OPENAI_API_KEY
})

const instructionMessage: ChatCompletionMessageParam = {
    role: "system",
    content: "You are a code generator. You should answer in markdown code snippets. Also explain your code briefly."
};

export async function POST(req: Request) {
    try 
    {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if (!openai.apiKey) {
            return new NextResponse("OpenAI API key not configured", {status: 500});
        }

        if (!messages) {
            return new NextResponse("Messages are required", {status: 400});
        }

        const freeTrial = await checkApiLimit();

        if (!freeTrial) {
            return new NextResponse("Free trial has expired!", {status: 403});
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [instructionMessage, ...messages]
        });

        await increaseApiLimit();

        return new NextResponse(JSON.stringify(response.choices[0].message))
    } 
    catch (error) 
    {
        console.log("[CODE_ERROR]", error);
        return new NextResponse("Internal error", {status: 500})
    }
}