import util from "node:util";
import { logError } from "../utils/logError.js";
import { reply, send, edit, dm, buildEmbed } from "../utils/embeds.js";
import { resolveUser, resolveRole } from "../utils/resolver.js";

export default {
  name: "eval",
  description: "Evaluates JavaScript code",
  async execute(client, msg, args) {
    let code = args.join(" ");

    const keep = /--keep\b/i.test(code);

    code = code.replace(/--keep\b/gi, "").trim();

    try {
      const result = await eval(`(async () => { ${code} })()`);

      const output =
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
          { name: "output", value: `\`\`\`js\n${output.slice(0, 1000)}\n\`\`\`` },
        ],
      });
    } catch (err) {
      logError(err);
    } finally {
      if (!keep) {
        setTimeout(() => msg.delete().catch(() => {}), 1000);
      }
    }
  },
};
