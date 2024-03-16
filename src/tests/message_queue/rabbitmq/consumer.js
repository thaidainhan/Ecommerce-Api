const amqplib = require("amqplib");

const messages = "Hello, RabbitMQ !";

const url = "amqp://guest:12345@localhost";

const runConsume = async () => {
  try {
    const connection = await amqplib.connect(url);
    const channel = await connection.createChannel();

    const queueName = "test-topic";
    await channel.assertQueue(queueName, {
      durable: true,
    });
    channel.consume(
      queueName,
      (message) => console.log({ message: message.content.toString() }),
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error(error);
  }
};

runConsume().catch(console.error);
