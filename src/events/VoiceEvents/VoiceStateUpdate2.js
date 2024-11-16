const { EmbedBuilder } = require(`discord.js`);
module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        let joinchannelSchema = require('../../schemas/jointocreatechannel');
        try {
            if (oldState.member.guild === null) return;
        } catch (err) {
            console.error(err);
            return;
        }
        const leavechanneldata = await joinchannelSchema.findOne({
            Guild: oldState.member.guild.id,
            User: oldState.member.id,
        });

        if (!leavechanneldata) return;
        else {
            const voicechannel = await oldState.member.guild.channels.fetch(
                leavechanneldata.Channel
            );

            try {
                await voicechannel.delete();
            } catch (err) {
                console.error(err);
                return;
            }

            await joinchannelSchema.deleteMany({
                Guild: oldState.guild.id,
                User: oldState.member.id,
            });
            try {
                const embed = new EmbedBuilder()
                    .setColor("Random")
                    .addFields({
                        name: "Channel Deleted",
                        value: `${newState.member.guild.name}`,
                    });

                await newState.member.send({ embeds: [embed] });
            } catch (err) {
                console.error(err);
                return;
            }
        }
    }
};