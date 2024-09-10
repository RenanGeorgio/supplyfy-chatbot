// const key = process.env.DIRECT_LINE_CRYPTO_KEY ?? "HdfJwgk80Cga8CLMR19K0oqEufHQol5d"
// const iv = process.env.DIRECT_LINE_CRYPTO_IV ?? "9GJ4xH9VEAZUYKOP"

// const encode = (data: string) => {
//     let cipher = createCipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv));
//     let encrypted = cipher.update(data);
//     encrypted = Buffer.concat([encrypted, cipher.final()]);
//     return encrypted.toString('hex');
// }

// export const decode = (data: string) => {
//     let encryptedText = Buffer.from(data, 'hex');
//     let decipher = createDecipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv));
//     let decrypted = decipher.update(encryptedText);
//     decrypted = Buffer.concat([decrypted, decipher.final()]);
//     return decrypted.toString();
// }