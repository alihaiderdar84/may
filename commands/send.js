export default {
  name: "send",
  description: "Repeats the user message",
  async execute(client, msg, args) {
    const message = args.join(" ");
    msg.delete().catch(() => {});
    const refId = msg.reference?.messageId;
    if (refId) {
      try {
        const refMsg = await msg.channel.messages.fetch(refId);
        return refMsg.reply(message);
      } catch {
        return msg.channel.send(message);
      }
    } else {
      return msg.channel.send(message);
    }
  },
};
