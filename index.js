require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.login(process.env.discordtoken);

const Twitter = require('twitter-lite')
const app = new Twitter({
  subdomain: "api", // "api" is the default (change for other subdomains)
  version: "1.1", // version "1.1" is the default (change for other subdomains)
  consumer_key: process.env.consumer_key, // from Twitter.
  consumer_secret: process.env.consumer_secret, // from Twitter.
  access_token_key: process.env.token, // from your User (oauth_token)
  access_token_secret: process.env.secret // from your User (oauth_token_secret)
});

app
  .get("account/verify_credentials")
  .then(results => {
    console.log("results", results);
  })
  .catch(console.error);

async function tweet(update) {
  const tweet = await app.post("statuses/update", {
    status: update,
  });
}

var react = "🐀";
var comfirm = "❤️";
var comfchannel;

client.once('ready', () => {
	console.log('Ready!');
});


client.on('message', message => {
	let list = message.content.split(" ");

	if(list[0] == "yb!"){
		console.log(list);
		console.log(message.author);
		if(list[1] == "tweet"){
			console.log("hello")
			tweet("hello").catch(console.error);
		}
		if(list[1] == "setcomf"){
			message.channel.send("Affrimative!");
			comfchannel = message.channel;
		}
	}
})

client.on('messageReactionAdd', async (reaction, user) => {
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			return;
		}
	}
	if(reaction._emoji.name == react){
		if(reaction.count >= 1){
			let user = reaction.message.author;
			comfchannel.send(`send? | ${user} | ` + reaction.message.content)
		}
	}

	if(reaction._emoji.name == comfirm){
		if(reaction.message.author.id == '721192541407674368'){
			var parts = reaction.message.content.split(' | ')
			console.log(parts)
			if(parts[0] == 'send?'){
				for (var user of reaction.message.mentions.users){
					for(var check of reaction.users.cache){
						if(user[0] == check[0]){
							tweet(parts[2]);
						}
					}
				}
			}

		}

	}

	//
	// console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
	//
	// console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
});
