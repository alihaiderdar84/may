import { exec } from "node:child_process";

export default {
  name: "reboot",
  desc: "Reboots the bot",
  async execute(client, msg, args) {
    msg.react("✅");
    exec("pm2 restart may", (err) => {
      msg.react("☑️");
      if (err) exec("pm2 restart all");
    });
  },
};
