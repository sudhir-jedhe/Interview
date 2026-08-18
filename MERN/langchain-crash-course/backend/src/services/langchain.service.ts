import { ChatGoogle } from "@langchain/google/node";

import { ChatPromptTemplate } from "@langchain/core/prompts";

import { ChatOpenAI } from "@langchain/openai";
import { RecommendationsSchema } from "../schemas/movie.schema";

function getChatModel() {
  const provider = process.env.LLM_PROVIDER ?? "openai";

  if (provider === "google") {
    return new ChatGoogle({
      model: "gemini-2.5-flash",
      temperature: 0.3,
      // lower the temp = more consistent
      // less random answers
    });
  }

  return new ChatOpenAI({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: 0.3,
  });
}

const model = getChatModel();

const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    // system message = who the AI is + how it should behave
    // sent on every req before the users message
    // sets the personality and rules for the system
    `You are a movie recommendation expert.

Return high-quality recommendations based on:
- user's request
- genre
- mood
- count

Every movie should feel intentional.
Do not recommend only the most obvious titles every time.`,
  ],
  [
    "human",
    // human msg - user's req with variables
    `User request: {userPrompt}

Preferences:
- Genre: {genre}
- Mood: {mood}
- Number of movies: {count}`,
  ],
]);

export async function getRecommendations(input: {
  userPrompt: string;
  genre: string;
  mood: string;
  count: number;
}) {
  const chain = promptTemplate.pipe(model);

  // .pipe(model) = LCEL - langchain expression langauage
  // connecys componets into a chain
  // input - promptteample  -> variables - call model (gemini) - response

  const response = await chain.invoke({
    userPrompt: input.userPrompt,
    genre: input.genre,
    mood: input.mood,
    count: input.count,
  });

  console.log(response.text);

  return response.text;
}

//  zod + structured output

const structuredModel = model.withStructuredOutput(RecommendationsSchema);

export async function getStructuredRecommendations(input: {
  userPrompt: string;
  genre: string;
  mood: string;
  count: number;
}) {
  const chain = promptTemplate.pipe(structuredModel);

  const result = await chain.invoke({
    userPrompt: input.userPrompt,
    genre: input.genre,
    mood: input.mood,
    count: input.count,
  });

  console.log(result);

  return result;
}
