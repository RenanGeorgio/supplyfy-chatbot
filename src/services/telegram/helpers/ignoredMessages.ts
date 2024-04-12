export function ignoredMessages(text: string) {
  return ["/start", "/suporte"].includes(text);
}
