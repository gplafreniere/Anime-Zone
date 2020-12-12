const {si} = require('nyaapi')
const Discord = require('discord.js');
const { SEARCH_NUMBER, SEEDER_THRESHOLD } = require('../config.json');

module.exports = {
	async findShow(message, title, quality) {
		getList()
		.then(handleData)
  		.catch((err) => console.log(err))

  		function handleData(data) {
			var embed = new Discord.MessageEmbed()
			 	.setColor('#EFFF00')
			  	.setTitle("Torrent List")
				.setTimestamp()
				.setFooter("Brought to you by Anime-Zone!");

			data.forEach(torrent => {
				var name = torrent.name;
				var id = torrent.id;
				embed.addFields({ name: "Torrent:", value: `[${name}](https://nyaa.si/view/${id})`},
								{ name: "Seeders:", value: torrent.seeders, inline: true},
								{ name: "File size:", value: torrent.filesize, inline: true})
			});

			message.channel.send(embed).then(sentEmbed => {
    			// sentEmbed.react("✅")
    			// sentEmbed.react("❌")
    		});
		}

		async function getList() {
			//return the larger set of torrents according to User's preferences
			var englishList = await si.search({
  										term: title.english+" "+quality,
  										n: SEARCH_NUMBER,
  										filter: 0,
 										category: '1_2',
									})
			englishList = englishList.filter(filterBySeeders)
			englishList = englishList.sort(compareSeeders);

			var romajiList = await si.search({
								term: title.romaji+" "+quality,
								n: SEARCH_NUMBER,
								filter: 0,
								category: '1_2',
						})

			romajiList = romajiList.filter(filterBySeeders)
			romajiList = romajiList.sort(compareSeeders);

			return (romajiList > englishList ? romajiList : englishList);
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