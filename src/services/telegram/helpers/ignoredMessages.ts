export function ignoredMessages(text: string) {
  return ["/start", "/suporte", "/stop"].includes(text);
}
