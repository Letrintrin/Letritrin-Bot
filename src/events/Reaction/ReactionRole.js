module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user) {
        let reactions = require("../../schemas/reactionroleSchema");
        if (!reaction.message.guildId) return;
        if (user.bot) return;

        let CID = `<a:${reaction.emoji.name}:${reaction.emoji.id}>`;

        if (!reaction.emoji.id) CID = reaction.emoji.name;

        const data = await reactions.findOne({
            Guild: reaction.message.guildId,
            Emoji: `${CID}`,
        });

        if (!data) return;

        const guild = client.guilds.cache.get(reaction.message.guildId);
        const member = guild.members.cache.get(user.id);
        try {
            await member.roles.add(data.Role);
        } catch (e) {
            console.log("Error!");
        }
    }
};