import { ask } from "../utils/ai.js";


export default {
    name: "ai",
    desc: "Answers to given prompt using gemini",
    async execute(client, msg, args) {
        const prompt = args.join(" ").trim();

        if (!prompt) return;

        const response = await ask(msg, prompt);

        msg.reply(response);
    }
}