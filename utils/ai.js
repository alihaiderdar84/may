import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const conversations = new Map();

const ask = async (msg, prompt) => {
  const id = msg.author.id;
  const input = `${prompt} (Respond concisely in 1-2 short sentences.);`;
  const previous = conversations.get(id);

  await msg.channel.sendTyping();

  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.5-flash-lite",
      previous_interaction_id: previous,
      input,
    });

    conversations.set(id, interaction.id);

    return interaction.output_text;
  } catch (err) {
    logError(err);
  }
};

export { ask };
