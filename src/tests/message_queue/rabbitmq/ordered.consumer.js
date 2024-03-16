"use strict";
const amqplib = require("amqplib");
const url = "amqp://guest:12345@localhost";

async function consumerOrderedMessage() {
  const connection = await amqplib.connect(url);
  const channel = await connection.createChannel();

  const queueName = "ordered-queue-message";

  // set prefetch to 1 to ensure only one ack at a time

  channel.prefetch(1)

  channel.consume(queueName, (msg) => {
    const message = msg.content.toString();

    setTimeout(() => {
        console.log(`processed`, message);
        channel.ack(msg)
    }, Math.random() * 1000);
  });
}

consumerOrderedMessage().catch(console.error);
