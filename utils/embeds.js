import { EmbedBuilder } from "discord.js";
import { getConfig } from "./watcher.js";

const buildEmbed = (msg, options = {}) => {
    const { title, desc, color = getConfig().embeds.color, footer = getConfig().embeds.footer, timestamp = getConfig().embeds.timestamp, author = getConfig().embeds.author, fields = [] } = options;

    const embed = new EmbedBuilder()
    .setColor(color)

    if (title) embed.setTitle(title);
    if (desc) embed.setDescription(desc);
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

const send = (msg, options) => {
    const embed = buildEmbed(msg, options);
    return msg.channel.send({ embeds: [embed] });
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
        console.log(`dm failed: ${err}`);
    }
}

export { reply, send, edit, dm };