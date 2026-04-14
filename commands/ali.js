import { send, reply, dm, edit } from "../utils/embeds.js";
export default {
    name: "ali",
    description: "test command",
    execute(client, msg, args) {
        dm(msg, msg.author, { desc: "why you so goated"})
    }
}