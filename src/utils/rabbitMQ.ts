// src/utils/rabbitMQ.ts
import amqp from "amqplib";

let channel: amqp.Channel | null = null;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Failed to connect to RabbitMQ", error);
  }
};

// Publish message to RabbitMQ
export const publishToQueue = async (queue: string, message: any) => {
  if (channel) {
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    console.log("Message published to queue:", queue);
  }
};

// Consume message from RabbitMQ
export const consumeFromQueue = async (
  queue: string,
  callback: (msg: amqp.ConsumeMessage | null) => void
) => {
  if (channel) {
    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, callback, { noAck: true });
    console.log("Started consuming messages from queue:", queue);
  }
};
