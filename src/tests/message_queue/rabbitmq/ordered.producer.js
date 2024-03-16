"use strict";
const amqplib = require("amqplib");
const url = "amqp://guest:12345@localhost";

async function consumerOrderedMessage() {
  const connection = await amqplib.connect(url);
  const channel = await connection.createChannel();

  const queueName = "ordered-queue-message";
  await channel.assertQueue(queueName, {
    durable: true,
  });

  for (let number = 0; number < 10; number++) {
    const message = `order: ${number}`;
    console.log({message});
    channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true,
    });

    setTimeout(() => {
      connection.close();
    }, 1000);
  }
}

consumerOrderedMessage().catch(console.error);
