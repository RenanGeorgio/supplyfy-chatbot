export const split = (mailText: string, delimiter: string) => {
  const parts = mailText.split(delimiter);
  if (parts.length > 0) {
    return parts[0].trim();
  }
};

export const filter = (mailText: string) => {
  const delimiters = ["___", "  Em"];

  for (const delimiter of delimiters) {
    if (mailText.includes(delimiter)) {
      return split(mailText, delimiter);
    }
  }

  return mailText;
};
