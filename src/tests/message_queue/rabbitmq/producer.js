const amqplib = require("amqplib");

const messages = "Hello, RabbitMQ !";

const url = "amqp://guest:12345@localhost";

const runProducer = async () => {
  try {
    const connection = await amqplib.connect(url);
    const channel = await connection.createChannel();

    const queueName = "test-topic";
    await channel.assertQueue(queueName, {
      durable: true,
    });
    channel.sendToQueue(queueName, Buffer.from(messages));

    console.log(`Message sent: ` + messages);

    
  } catch (error) {
    console.error(error);
  }
};

runProducer().catch(console.error)
