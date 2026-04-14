import { WebhookClient } from "discord.js";
import { getConfig } from "./watcher.js";
import { buildEmbed } from "./embeds.js";

let webhook; 

const getWebhook = () => {
    if (!webhook) webhook = new WebhookClient({ url: getConfig().errorWebhook});
    return webhook;
}

const logError = (error) => {
    console.error(error);
    const webhook = getWebhook();
    const content = (error.stack || error.message || String(error)).slice(0, 1999);
    const embed = buildEmbed(null, { title: "Bot error", desc: content, type: "error", author: false });
    webhook.send({ embeds: [embed]});
}

export { logError };