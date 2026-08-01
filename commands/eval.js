import util from "node:util";
import { logError } from "../utils/logError.js";
import { reply, send, edit, dm, buildEmbed } from "../utils/embeds.js";
import { resolveUser, resolveRole } from "../utils/resolver.js";
import { executeCmd } from "../utils/executeCmd.js";

export default {
  name: "eval",
  description: "Evaluates JavaScript code",
  async execute(client, msg, args) {
    let code = args.join(" ");

    const keep = /--keep\b/i.test(code);
    const k = /-k\b/i.test(code);

    if (keep) code = code.replace(/--keep\b/gi, "").trim();
    else if (k) code = code.replace(/-k\b/gi, "").trim();


    const run = async (commandName, ...args) => {
      await executeCmd(client, msg, commandName, args);
    };

    try {
      const result = await eval(`(async () => { ${code} })()`);

      let output =
        typeof result === "string"
          ? result
          : util.inspect(result, {
              depth: 1,
            });
      if (output.length > 1900) output = output.slice(0, 1900) + "...";

      await dm(msg, msg.author, {
        title: "Eval Result",
        fields: [
          { name: "code", value: `\`\`\`js\n${code.slice(0, 1000)}\n\`\`\`` },
          {
            name: "output",
            value: `\`\`\`js\n${output.slice(0, 1000)}\n\`\`\``,
          },
        ],
      });
    } catch (err) {
      logError(err);
    } finally {
      if (!keep && !k) {
        setTimeout(() => msg.delete().catch(() => {}), 1000);
      }
    }
  },
};
