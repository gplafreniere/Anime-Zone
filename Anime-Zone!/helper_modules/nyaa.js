const {si} = require('nyaapi')
const Discord = require('discord.js');
const torrentFile = require("./torrent.js");
const { SEARCH_NUMBER, SEEDER_THRESHOLD } = require('../config.json');
const CHOICES = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];
const INDEXARR = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eight", "Ninth", "Tenth"];

module.exports = {
	async findShow(message, title, quality) {
		getList()
		.then(handleData)
  		.catch((err) => console.log(err))

  		async function handleData(data) {
			var embed = new Discord.MessageEmbed()
			 	.setColor('#EFFF00')
			  	.setTitle("Torrent List")
				.setTimestamp()
				.setFooter("Brought to you by Anime-Zone!");

			let num = 1;
			data.forEach(torrent => {
				var name = torrent.name;
				var id = torrent.id;
				embed.addFields({ name: `Torrent ${num++}:`, value: `[${name}](https://nyaa.si/view/${id})`},
								{ name: "Seeders:", value: torrent.seeders, inline: true},
								{ name: "File size:", value: torrent.filesize, inline: true})
			});

			message.channel.send(embed).then(sentEmbed => {
				for (i = 0; i < data.length; i++) {
					sentEmbed.react(CHOICES[i]);
				}
				sentEmbed.awaitReactions((reaction, user) => user.id == message.author.id && CHOICES.includes(reaction.emoji.name),
			                { max: 1, time: 15000 }).then(collected => {
			                	let chosenTorrent = CHOICES.indexOf(collected.first().emoji.name)
			                	torrentFile.startDownload(message,title,data[chosenTorrent]);
			                }).catch(() => {
			                        message.channel.send('No reaction after 15 seconds, operation canceled.');
			                });
			});
		}

		async function getList() {
			// //return the larger set of torrents according to User's preferences
			const baseOptions = {
				n: SEARCH_NUMBER,
				filter: 0,
				category: '1_2',
			};

			const englishOptions = Object.assign({term: `${title.english} ${quality}`}, baseOptions);
			const romajiOptions = Object.assign({term: `${title.romaji} ${quality}`}, baseOptions);

			let englishList = await si.search(englishOptions)
			englishList = englishList.filter(filterBySeeders)
			englishList = englishList.sort(compareSeeders);

			let romajiList = await si.search(romajiOptions)
			romajiList = romajiList.filter(filterBySeeders)
			romajiList = romajiList.sort(compareSeeders);

			return (romajiList.length >= englishList.length ? romajiList : englishList);
		}

		function compareSeeders(torrent1, torrent2) {
			return parseInt(torrent2.seeders) - parseInt(torrent1.seeders);
		}

		function filterBySeeders(torrent) {
			if (parseInt(torrent.seeders) >= SEEDER_THRESHOLD) {
				return true
			} 
				return false;
		}
	}
}