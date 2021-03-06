require("dotenv").config();
const { Client, APIMessage, Message } = require("discord.js");
const client = new Client();

client.on("message", async message => {
    if(message.author.bot || message.channel.type == "dm" || message.webhookID) return;

    if(message.content == ";t") {
        message.quote("...");
    };
});

Message.prototype.quote = async function (content, options) {
  const reference = {
    message_id: (
      !!content && !options
        ? typeof content === 'object' && content.messageID
        : options && options.messageID
    ) || this.id,
    message_channel: this.channel.id
  }

  const { data: parsed, files } = await APIMessage
    .create(this, content, options)
    .resolveData()
    .resolveFiles()

  let msg = await this.client.api.channels[this.channel.id].messages.post({
    data: { ...parsed, message_reference: reference },
    files
  })

  await this.channel.messages.fetch(msg.id)
            .then(message => msg = message)
            .catch((err) => {
                console.log(err.stack)
            });

  return msg;
};

client.login(process.env.TOKEN);