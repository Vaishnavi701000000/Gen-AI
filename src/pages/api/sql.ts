const { Configuration, OpenAIApi } = require("openai");
// import type { NextApiRequest, NextApiResponse } from "next";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req: any, res: any) {
  const { query } = req.body;
  let prompt = `Translate this natural language query into SQL:\n\n"${query}"\n\nSQL Query:`;
  try {
    const response = await openai.createCompletion({
      temperature: 0.5,
      max_tokens: 2048,
      n: 1,
      stop: "\\n",
      model: "text-davinci-003",
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
      logprobs: 10,
      prompt,
    });
    res.status(200).json({
      data: response.data.choices[0].text.trim(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
}
