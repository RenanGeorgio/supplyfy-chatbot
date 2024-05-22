import typebotApi from "./typebotApi";

export const startChat = async (typebotId: string) => {
  const { data } = await typebotApi.post(
    `/typebots/${typebotId}/startChat`,
    {}
  );
  return data;
};

export const continueChat = async (sessionId: string, message: string) => {
  const { data } = await typebotApi.post(
    `/sessions/${sessionId}/continueChat`,
    { message }
  );
  return data;
};
