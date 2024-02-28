import openaiApi from "./openAi";

const getAnswer = async (text: string) => {
  try {
    const response = await openaiApi.createCompletion({
      model: "text-davinci-003",
      prompt: text,
      temperature: 0,
      max_tokens: 500,
    });

    return response.data.choices[0].text;
  } catch (error) {
    console.log(error);
  }
};

export default getAnswer;
