
export const findBot = <T extends { id: string }>(id: string, bots: T[]) => {
  const bot = bots.find((service) => service.id === id);
  
  if (bot) {
    return bot;
  } else {
    return null;
  }
};

export const removeBot = <T>(bot: T, bots: T[]) => {
  const index = bots.indexOf(bot)
  bots.splice(index, 1)
  return bots
};