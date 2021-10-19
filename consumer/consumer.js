require('dotenv').config();

const amqp = require('amqplib');
const Listener = require('./services/listener');
const MailSender = require('./services/MailSender');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const CacheService = require('./services/redis/CacheService');

const init = async () => {
  const cacheService = new CacheService();
  const playlistsService = new PlaylistsService(cacheService);
  const mailSender = new MailSender();
  const listener = new Listener(playlistsService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue(process.env.QUEUE_NAME, {
    durable: true,
  });

  channel.consume(process.env.QUEUE_NAME, listener.listen, { noAck: true });

  console.log(`Consumer berjalan pada ${process.env.RABBITMQ_SERVER}`);
};

init();
