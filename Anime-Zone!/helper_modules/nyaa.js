const {si} = require('nyaapi')
const Discord = require('discord.js');
const { SEARCH_NUMBER } = require('../config.json');

module.exports = {
	findShow(message, args) {
		si.search({
  			term: args+' 1080p',
  			n: SEARCH_NUMBER,
  			filter: 0,
 			category: '1_2',
		})
		.then(handleData)
  		.catch((err) => console.log(err))

  		function handleData(data) {
			data = data.filter(filterBySeeders)
			data = data.sort(compareSeeders);

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
    			sentEmbed.react("✅")
    			sentEmbed.react("❌")
    		});
		}

		function compareSeeders(torrent1, torrent2) {
			return parseInt(torrent2.seeders) - parseInt(torrent1.seeders);
		}

		function filterBySeeders(torrent) {
			if (parseInt(torrent.seeders) >= 10) {
				return true
			} 
				return false;
		}
	}
}