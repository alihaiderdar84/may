export default {
    name: "send",
    description: "Repeats the user message",
    execute(client, msg, args) {
        const message = args.join(" ");
        msg.delete();
        msg.channel.send(message);
    }
}