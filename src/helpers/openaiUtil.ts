// import openaiApi from "./openAi";

// const getAnswer = async (text: string) => {
//   try {
//     const response = await openaiApi.beta.chat.completions.stream({
//       model: "gpt-3.5-turbo",
//       messages:[{ role: 'user', content: text}],
//       temperature: 0,
//       max_tokens: 500,
//     });
  
//     response.on('content', (delta, snapshot) => {
//       process.stdout.write(delta);
//     });
  

//     const chatCompletion = await response.finalChatCompletion();
//     console.log(chatCompletion); // {id: "…", choices: […], …}
//     return chatCompletion.choices[0].message.content;
  
//   } catch (error) {
//     console.log(error);
//   }
// };

// export default getAnswer;
