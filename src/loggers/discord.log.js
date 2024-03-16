'use strict';

const {Client, GatewayIntentBits} = require("discord.js")


const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.on('ready', () => {
    console.log(`Logged is as ${client.user.tag}`);
})

const token = "MTE4NTEyNDI3NzU4NzAzODIyOA.GOJmF-.c5Ooy7H1TrvgoGTggcngbcQzvg9LpszN79CXfc"
client.login(token)

client.on('messageCreate', msg => {
    if(msg.author.bot){
        return;
    }
    
    if(msg.content === "hello"){
        msg.reply(`Hello! How can i assits you today?`)
    }
})