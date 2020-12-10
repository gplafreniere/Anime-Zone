const fetch = require('node-fetch');
const querystring = require('querystring');
const Discord = require('discord.js');

const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

module.exports = {
	name: 'shows',
	description: "Query Anilist for a series and confirm/deny the selection",
	cooldown: 3,
	async execute(message, args) {
		if (!args.length) {
    		return message.channel.send('You need to supply a search term!');
  		}

  		const searchTerm = args.join(' ');

		var query = `
		query ($search: String) { # Define which variables will be used in the query
		  Media (search: $search, type: ANIME) { # Insert our variables into the query arguments 
		    siteUrl
		    description(asHtml: false)
		    episodes
		    averageScore
		    coverImage {
		    	extraLarge
		    }
		    title {
		      romaji
		      english
		      native
		    }
		  }
		}
		`;

		var variables = {
		    search: searchTerm,
		};

		var url = 'https://graphql.anilist.co',
		    options = {
		        method: 'POST',
		        headers: {
		            'Content-Type': 'application/json',
		            'Accept': 'application/json',
		        },
		        body: JSON.stringify({
		            query: query,
		            variables: variables
		        })
		    };

    	fetch(url, options).then(handleResponse)
                   .then(handleData)
                   .catch(handleError);

        function handleResponse(response) {
    		return response.json().then(function (json) {
        		return response.ok ? json : Promise.reject(json);
    		});
		}

		function handleData(data) {
			const embed = new Discord.MessageEmbed()
			 	.setColor('#EFFF00')
			  	.setTitle(data.data.Media.title.romaji)
				.setURL(data.data.Media.siteUrl)
				.setThumbnail(data.data.Media.coverImage.extraLarge)
				.setDescription(trim(data.data.Media.description, 300))
				.addFields(
				 	{ name: 'Episodes', value: data.data.Media.episodes, inline: true },
				 	{ name: 'Rating', value: data.data.Media.averageScore+`%`, inline: true },
				)
				.setTimestamp()
				.setFooter("Brought to you by Anime-Zone!");

			message.channel.send(embed).then(sentEmbed => {
    			sentEmbed.react("✅")
    			sentEmbed.react("❌")
				sentEmbed.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '✅' || reaction.emoji.name == '❌'),
                            { max: 1, time: 15000 }).then(collected => {
                                    if (collected.first().emoji.name == '✅') {
                                            message.channel.send('Poggers');
                                    }
                                    else
                                            message.channel.send('Cringe');
                            }).catch(() => {
                                    message.channel.send('No reaction after 15 seconds, operation canceled.');
                            });
                });
		}

		function handleError(error) {
			const embed = new Discord.MessageEmbed()
			 	.setColor('#EFFF00')
			  	.setTitle("Show Not Found")
				.setDescription(trim("I couldn't find your show on Anilist. Did you type the wrong name?"))
				.setTimestamp()
				.setFooter("Brought to you by Anime-Zone!");

			message.channel.send(embed);
		}
	}
}