import { Client, Events, GatewayIntentBits } from "discord.js";
import { token } from "./config.json";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}`)
});