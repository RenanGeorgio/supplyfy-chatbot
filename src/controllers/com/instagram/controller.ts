export const sendPrivateReply = (type: string, object_id: string, response: string) => {
  const sendInstagramMessage = async (response: string) => {
    // const answer = await processQuestion(response);
      
    const requestBody = {
      recipient: {
        [type]: object_id,
      },
      // message: answer,
      tag: "HUMAN_AGENT",
    };

    await callSendApi(requestBody);
  }
  
  sendInstagramMessage(response);

  return;
}