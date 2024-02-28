import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAIAPI,
});

const openaiApi = new OpenAIApi(configuration);

export default openaiApi;

