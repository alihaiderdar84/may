export default {
    name: "say",
    description: "Repeats the user message",
    execute(msg, args) {
        const message = args.join(" ");
        msg.delete();
        msg.channel.send(message);
    }
}