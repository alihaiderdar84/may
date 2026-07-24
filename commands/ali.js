import { resolveUser, resolveRole } from "../utils/resolver.js";
export default {
    name: "ali",
    description: "test command",
   async execute(client, msg, args) {
        const ali = await resolveUser(client, msg, args[0]);
        console.log(ali);
        msg.reply(ali.username);
    }
}