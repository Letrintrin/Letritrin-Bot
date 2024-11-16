const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType,} = require("discord.js");
const jointocreate = require("../../schemas/jointocreate.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join-to-create")
    .setDescription("Setup and disable your join to create system.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((command) =>
        command
          .setName("setup")
          .setDescription("Sets up your join to create voice channel.")
          .addChannelOption((option) =>
            option
              .setName("channel")
              .setDescription(
                "The channel you want to be your join to create vc."
              )
              .setRequired(true)
              .addChannelTypes(ChannelType.GuildVoice)
          )
          .addChannelOption((option) =>
            option
              .setName("category")
              .setDescription("The category for the new Vcs to be created in.")
              .setRequired(true)
              .addChannelTypes(ChannelType.GuildCategory)
          )
          .addIntegerOption((option) =>
            option
              .setName("voice-limit")
              .setDescription("Set the default limit for the new voice channels.")
              .setMinValue(2)
              .setMaxValue(10)
              .setRequired(false)
          )
      )
      .addSubcommand((command) =>
        command
          .setName("disable")
          .setDescription("Disable yourjoin to create voice channels.")
      ),
  async execute(interaction, client) {
    const data = await jointocreate.findOne({ Guild: interaction.guild.id });
    const sub = interaction.options.getSubcommand();
    switch (sub) {
      case "setup":
        if (data)
          return await interaction.reply({
            content: "You already have a join to create setup.",
          });
        else {
          const channel = interaction.options.getChannel("channel");
          const category = interaction.options.getChannel("category");
          const limit = interaction.options.getInteger("voice-limit") || 4;

          await jointocreate.create({
            Guild: interaction.guild.id,
            Channel: channel.id,
            Category: category.id,
            VoiceLimit: limit,
          });
          const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(
              `The join to create system has been setup in ${channel} all new VCs will be created in ${category}`
            );
          await interaction.reply({ embeds: [embed] });
        }
        break;
      case "disable":
        if (!data)
          return await interaction.reply({
            content: "You do not have the join to create setup yet.",
          });
        else {
          const embed2 = new EmbedBuilder().setDescription(
            "The join to create system is now disabled."
          );

          await jointocreate.deleteMany({ Guild: interaction.guild.id });
          await interaction.reply({ embeds: [embed2] });
        }
    }
  },
};
