const { EmbedBuilder, ChannelType } = require(`discord.js`);
module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState) {






    try {
      if (newState.member.guild === null) return;
    } catch (err) {
      console.error(err);
      return;
    }
    let joinSchema = require('../../schemas/jointocreate');
    let joinchannelSchema = require('../../schemas/jointocreatechannel');
    const joindata = await joinSchema.findOne({ Guild: newState.guild.id });
    const joinchanneldata = await joinchannelSchema.findOne({
      Guild: newState.member.guild.id,
      User: newState.member.id,
    });

    const voicechannel = newState.channel;
    if (!joindata) return;
    if (!voicechannel) {
      return;
    } else {
      if (voicechannel.id === joindata.Channel) {
        if (joinchanneldata) {
          try {
            return await newState.member.send({
              content: "You already have a voice channel.",
            });
          } catch (err) {
            return;
          }
        } else {
          try {
            const channel = await newState.member.guild.channels.create({
              type: ChannelType.GuildVoice,
              name: `${newState.member.user.username}-room`,
              userLimit: joindata.VoiceLimit,
              parent: joindata.Category,
            });
            try {
              await newState.member.voice.setChannel(channel.id);
            } catch (err) {
              return;
            }
            setTimeout(() => {
              joinchannelSchema.create({
                Guild: newState.member.guild.id,
                Channel: channel.id,
                User: newState.member.id,
              });
            }, 500);
          } catch (err) {
            console.error(err);
            return;
          }
        }
        try {
          const embed = new EmbedBuilder()
              .setColor("Random")
              .addFields({
                name: "Channel Created",
                value: `${newState.member.guild.id}`,
              });
          await newState.member.send({ embeds: [embed] });
        } catch (err) {

        }
      }
    }
  },
};

