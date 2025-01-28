const chalk = require("chalk");
const Discord = require('discord.js-selfbot-v13');
const Authorization = process.env.Authorization;

const SOURCE_CHANNEL_ID = "111996776255981572";  // Source channel ID
const TARGET_CHANNEL_ID = "1279574748837449759";  // Target channel ID
const MESSAGE_ID = "1333849956997660733"; // The specific message ID to forward

const client = new Discord.Client({ checkUpdate: false });

client.once('ready', async () => {
  console.log(`${client.user.username}#${client.user.discriminator} (${client.user.id})!`);

  try {
    // Step 1: Fetch the source channel using its ID
    console.log('Fetching source channel...');
    const sourceChannel = await client.channels.fetch(SOURCE_CHANNEL_ID);
    console.log(`[${chalk.green.bold("+")}] Source channel fetched: ${sourceChannel.id}`);
    
    // Check if the fetched channel is indeed a text channel
    if (sourceChannel.type !== 'GUILD_TEXT') {
      console.log(`[${chalk.red.bold("!")} Error] Channel is not a valid text channel. Type: ${sourceChannel.type}`);
      return;
    }

    // Step 2: Fetch the latest 100 messages in the source channel to ensure access to the message history
    console.log('Fetching latest 100 messages...');
    const messages = await sourceChannel.messages.fetch({ limit: 100 });
    console.log(`[${chalk.green.bold("+")}] Fetched ${messages.size} messages from the source channel.`);

    // Step 3: Try to find the specific message by ID from the fetched messages
    const sourceMessage = messages.get(MESSAGE_ID);

    if (sourceMessage) {
      console.log(`[${chalk.green.bold("+")}] Message found: ${sourceMessage.id}`);

      // Step 4: Fetch the target channel
      console.log('Fetching target channel...');
      const targetChannel = await client.channels.fetch(TARGET_CHANNEL_ID);
      console.log(`[${chalk.green.bold("+")}] Target channel fetched: ${targetChannel.id}`);

      // Step 5: Forward the message to the target channel
      console.log('Forwarding message...');
      await sourceMessage.forward(targetChannel);
      console.log(`[${chalk.green.bold("+")}] Message forwarded to target channel`);
    } else {
      console.log(`[${chalk.yellow.bold("!")} Message with ID ${MESSAGE_ID} not found in the last 100 messages.`);
    }

  } catch (error) {
    console.error(`[Error] Failed to fetch source channel or forward message: ${error.message}`);
  }

  client.destroy();  // Log out after operation is complete
});

client.login(Authorization);