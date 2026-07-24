const resolveUser = async (client, msg, input) => {
  if (!input) return null;
  const userMention = input.match(/^<@!?(\d+)>$/);
  if (userMention) {
    return await client.users.fetch(userMention[1]).catch(() => null);
  }

  if (/^\d+$/.test(input)) {
    const id = input;

    if (msg.guild) {
      const member = msg.guild.members.cache.get(id);
      if (member) return member.user;
    }

    const user = await client.users.fetch(id).catch(() => null);
    if (user) return user;

    return null;
  }

  if (!msg.guild) return null;
  const query = input.replace("@", "").toLowerCase();

  let member = msg.guild.members.cache.find(
    (m) =>
      m.user.username.toLowerCase() === query ||
      m.displayName.toLowerCase() === query,
  );
  if (member) return member.user;

  try {
    await msg.guild.members.fetch();

    member = msg.guild.members.cache.find(
      (m) =>
        m.user.username.toLowerCase() === query ||
        m.displayName.toLowerCase() === query,
    );
    if (member) return member.user;
  } catch {}

  const partial = msg.guild.members.cache.find(
    (m) =>
      m.user.username.toLowerCase().includes(query) ||
      m.displayName.toLowerCase().includes(query),
  );
  return partial?.user ?? null;
};

const resolveRole = async (client, msg, input) => {
  if (!input) return null;
  if (!msg.guild) return;

  const roleMention = input.match(/^<@&(\d+)>$/);
  if (roleMention) {
    return msg.guild.roles.cache.get(roleMention[1]) || null;
  }

  if (/^\d+$/.test(input)) {
    const id = input;

    const role = msg.guild.roles.cache.get(id);
    if (role) return role;

    return null;
  }

  const query = input.replace("@", "").toLowerCase();

  const role = msg.guild.roles.cache.find(
    (r) => r.name.toLowerCase() === query,
  );
  if (role) return role;

  const partial = msg.guild.roles.cache.find((r) =>
    r.name.toLowerCase().includes(query),
  );
  return partial ?? null;
};

export { resolveUser, resolveRole }
