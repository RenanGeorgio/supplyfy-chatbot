export const enqueue = async (data) => {
  try {
    const result = await fetch(`${process.env.QUEUE_SERVER}/send-msg`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    // @ts-ignore
    console.error(error);
  }
};