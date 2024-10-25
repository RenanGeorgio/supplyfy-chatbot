import { ConfigurationBotFrameworkAuthentication, ConfigurationBotFrameworkAuthenticationOptions } from "botbuilder";

const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(process.env as ConfigurationBotFrameworkAuthenticationOptions);

export { botFrameworkAuthentication };