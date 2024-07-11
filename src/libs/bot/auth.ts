import { ConfigurationBotFrameworkAuthentication, ConfigurationBotFrameworkAuthenticationOptions } from "botbuilder";

export const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(process.env as ConfigurationBotFrameworkAuthenticationOptions);