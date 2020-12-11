module.exports = {
	name: 'help',
	description: "Give information on how to use the download command",
	cooldown: 3,
	aliases: [],
	async execute(message, args) {
		message.channel.send(`Welcome to Anime-Zone! A small Discord bot written to expedite the download process.\r\rUse **!shows** or **!download**, followed by the name of the show you want to download. The bot will check Anilist to find the show and confirm your download. If confirmed, the bot will download the highest-possible quality torrent from Nyaa.si and place it into the designated Plex directory for easy viewing.`);
	}
}