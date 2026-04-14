import { EmbedBuilder } from "discord.js";
import { getConfig } from "./watcher.js";
import { logError } from "./utils/logError.js";

const buildEmbed = (msg, options = {}) => {
    const { title, desc, color, type = "default", image, footer = getConfig().embeds.footer, timestamp = getConfig().embeds.timestamp, author = getConfig().embeds.author, fields = [] } = options;

    const embed = new EmbedBuilder()
    .setColor(color || getConfig().embeds.colors[type]);

    if (title) embed.setTitle(title);
    if (desc) embed.setDescription(desc);
    if (image) embed.setImage(image);
    if (footer) embed.setFooter({ text: footer.text, iconUrl: footer.footerIcon});
    if (timestamp) embed.setTimestamp();
    if (fields.length) embed.addFields(fields);

    if(author) {
        embed.setAuthor({
            name: msg.author.username,
            iconURL: msg.author.displayAvatarURL()
        })
    }

    return embed;
}

const reply = (msg, options) => {
    const embed = buildEmbed(msg, options);
    return msg.reply({ embeds: [embed] });
}

const send = (msg, channel, options) => {
    const embed = buildEmbed(msg, options);
    return channel.send({ embeds: [embed] });
}

const edit = (msg, message, options) => {
    const embed = buildEmbed(msg, options);
    return message.edit({ embeds: [embed] });
}

const dm = async (msg, user, options) => {
    try {
        const embed = buildEmbed(msg, options);
        await user.send({ embeds: [embed] });
    } catch (err) {
        logError(`dm failed: ${err}`);
    }
}


export { reply, send, edit, dm, buildEmbed };