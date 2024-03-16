const amqplib = require("amqplib");

const messages = "Hello, RabbitMQ !";

const url = "amqp://guest:12345@localhost";

const runProducer = async () => {
  try {
    const connection = await amqplib.connect(url);
    const channel = await connection.createChannel();

    const notificationExchange = `NotificationEx`; // Notification direct

    const notiQueue = "NotificationQueueProcess"; // Assert Queue
    const notificationExchangeDLX = `NotificationExDLX`; // Notification direct
    const notificationRoutingKeyDLX = `NotificationRoutingKeyDLX`; // Notification direct

    // 1. Create Exchange
    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    });

    // 2. Create Queue
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false, // cho phép các kết nối khác truy cập một lúc vào queue
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    });

    // 3. Bind Queue
    await channel.bindQueue(queueResult.queue, notificationExchange);

    // 4. Send message
    const msg = "a new product created";

    console.log(`product message: ` + msg);

    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: "10000",
    });

    // setTimeout(() => {
    //   connection.close();
    //   process.exit();
    // }, 1000);
  } catch (error) {
    console.error(error);
  }
};

runProducer().catch(console.error);
