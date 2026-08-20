import {
  createSession,
  getSession,
  deleteSession,
  evaluate,
} from "../utils/repl.js";
import { reply } from "../utils/embeds.js";

export default {
  name: "repl",
  description: "Interactive JavaScript REPL",
  async execute(client, msg, args) {
    const userId = msg.author.id;

    const { error } = createSession(userId, {
      client,
      msg,
      channel: msg.channel,
      guild: msg.guild,
      author: msg.author,
    });

    if (error) return reply (msg, { type: "error", desc: error })

     await reply(msg, {
      type: "success",
      desc: "REPL started",
    });

    const listener = async (message) => {
      if (message.author.id !== userId) return;

      const code = message.content.trim();

      if (code === "exit") {

        deleteSession(userId);
        client.off("messageCreate", listener);

        await reply(message, {
          type: "success",
          desc: "REPL closed",
        });

        return;
      }

      try {
        await evaluate(userId, code);
        await message.react("✅");
        
    } catch (err) {
      await message.reply(err.message);
    }
      } 

    client.on("messageCreate", listener);
  },
};
