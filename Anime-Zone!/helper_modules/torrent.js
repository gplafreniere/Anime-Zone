var WebTorrent = require('webtorrent')
const { FILEPATH } = require("../config.json")

module.exports = {
	async startDownload(message, showTitle, torrentData) {
		var client = new WebTorrent()
		message.reply(`your torrent of ${title.romaji} is starting now.`)
		client.add(torrentData.magnet, { path: `${FILEPATH}/${showTitle.romaji}` }, function (torrent) {
		  torrent.on('done', function () {
		    message.reply(`your torrent of ${showTitle.romaji} has finished and been moved to the server. Enjoy!`)
		  })
		})
  	}
}