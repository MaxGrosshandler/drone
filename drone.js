
const Eris = require('eris')
const config = require("./config.json")
const bot = new Eris.Client(config.token)
const fs = require("fs")
const auth0 = require("auth0-js")
let commands = [];
let helpCommands = [];
function readCommands() {
    fs.readdir("./commands", (err, files) => {
        if (err) console.error(err);
        files.forEach(file => {
            try {
                const command = require(`./commands/${file}`);


                let newCommand = [
                    command.name,
                    command.options.description,
                    command.options.fullDescription,
                    command.options.usage,
                    command.func,
                    command.hidden
                ];
                if (command.name !== "kick" && command.name !== "ban" && command.name !== "role" && command.name !== "steak") {
                    commands.push(command)
                }



                let hiddenCommands = ['eval', 'help', 'zombiewatch', 'stupidcat', 'kick', 'ban', 'role', 'o', 'clue', 'gnar', 'steak']
                if (!(hiddenCommands.includes(command.name))) {
                    helpCommands.push(newCommand);
                }

            }
            catch (err) {
                console.log(err.stack);
            }
        });
    });
}

bot.on("ready", () => { // When the bot is ready
    console.log("Drone is online"); // Log "Ready!"
});
bot.on("guildMemberAdd", async (guild, member) => {
 bot.createMessage("507189913817579530", "Hi <@" + member.id + ">, welcome to the server!"
 +" In order to stay on this server, you will need to set a passcode.")
})
var webAuth = new auth0.WebAuth({
    domain: config.AUTH0_DOMAIN,
    clientID: config.AUTH0_CLIENT_ID,
    redirectUri: config.AUTH0_CALLBACK_URL,
    responseType: 'token id_token',
    scope: 'openid',
    leeway: 60
  });


bot.on("messageCreate", async msg => {
    if (msg.author.bot) return;
    if(msg.content.toLowerCase() === "oauthtest"){
        webAuth.authorize();
        
    }
    if (msg.content.toLowerCase().startsWith("drone ")) {
        let stuff = msg.content.split(" ")
        let c = stuff[1];
        stuff.shift()
            commands.forEach(function (command) {
                if (command.name == c) {
                    stuff.shift();
                    command.func(msg, stuff)
                   
                }

            })
        
    }
    



})
readCommands()

bot.connect()