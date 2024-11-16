const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");
const reaction = require("../../schemas/reactionroleSchema.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("reaction-roles")
        .setDescription("Manage your reaction roles system")
        .addSubcommand((command) =>
            command
                .setName("add")
                .setDescription("Add a reaction role to a message")
                .addStringOption((option) =>
                    option
                        .setName("messageid")
                        .setDescription("The message you want to set reaction roles.")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("emoji")
                        .setDescription("The emoji to react with.")
                        .setRequired(true)
                )
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role you want to give.")
                        .setRequired(true)
                )
        )
        .addSubcommand((command) =>
            command
                .setName("remove")
                .setDescription("remove a reactionrole from a message. ")
                .addStringOption((option) =>
                    option
                        .setName("message-id")
                        .setDescription("The message you want to set reaction roles.")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("emoji")
                        .setDescription("the emoji to raect with")
                        .setRequired(true)
                )
        ),
    adminOnly: true,

    async execute(interaction) {
        console.log(interaction);
        const { options, guild, channel } = interaction;
        const sub = options.getSubcommand();
        const emoji = options.getString("emoji");
        let e;
        const message = await channel.messages.fetch(options.getString("message-id")).catch((err) => {
            e = err;
        });
        if (
            !interaction.member.permissions.has(
                PermissionsBitField.Flags.Administrator
            )
        )
            return interaction.reply({
                content: "You dont have permissions to use this command.",
                ephemeral: true,
            });
        if (e) {
            return interaction.reply({
                content: `Be sure to a get a message from ${channel}|`,
                ephemeral: true,
            });
        }
        console.log(message.id);
        const data = await reaction.findOne({
            Guild: guild.id,
            Message: message.id,
            Emoji: emoji,
        });
        switch (sub) {
            case "add":
                if(data) {
                    return await interaction.reply({
                        content:
                            "It looks like you already have this reaction roles setup.",
                    });
                } else {
                    const role = options.getRole("role");
                    await reaction.create({
                        Guild: guild.id,
                        Message: message.id,
                        Emoji: emoji,
                        Role: role.id,
                    });
                    const embed = new EmbedBuilder()
                        .setColor("Aqua")
                        .setDescription(
                            `I have added reaction role to ${message.url} with ${emoji} and the role ${role}`
                        );
                    await interaction.reply({ embeds: [embed] })
                }
                break;
            case 'remove':
                if (!data) {
                    return await interaction.reply({ content: 'Reaction role does not exist. '})
                } else {
                    await reaction.deleteMany({ Guild: guild.id, Message: message.id, Emoji: emoji });
                    const embed = new EmbedBuilder()
                        .setDescription(`I have removed reaction role from ${message.url} with ${emoji}`)
                    await interaction.reply({ embeds: [embed] });
                }
        }
    },
};

