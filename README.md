# Anime-Zone!
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/gplafreniere/Anime-Zone/graphs/commit-activity) [![Generic badge](https://img.shields.io/badge/node-v14.15.1-blue.svg)](https://nodejs.org/en/)

A small bot written in [discord.js](https://discord.js.org/#/) powered by [webtorrent](https://github.com/webtorrent/webtorrent). Originally planned to expedite the process of downloading shows from [Nyaa](https://nyaa.si/) for a Plex server.

# Usage
Fork the repo, and create your own Bot using the [Discord developer portal](https://discord.com/developers/applications). All the files are written, but you'll need to **edit the config.json file** to ensure that the settings are as you want them.

Type `!help` to get a cursory explanation, however the only supported command is `!shows` which has the aliases `!shows` and `!download`. Type the command followed by the name of the anime series/movie and the bot will begin the process.

# Planned Ideas
- [x] Handle movie downloads
- [ ] Support downloading magnet links directly via new command
- [ ] Filtering by Season
- [ ] Public release of the bot
- [ ] Supporting different sites for torrents
