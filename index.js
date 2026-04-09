import { Client, Events, GatewayIntentBits } from "discord.js";
import fs from "fs/promises";
import { getConfig } from "configWatcher.js";

const client = new Client({
	 intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent],
	 allowedMentions: {
		parse: ["users"]
	}});


client.once("clientReady", () => {
	console.log(`Logged in as ${client.user.tag}`)
});

client.login(getConfig.token);