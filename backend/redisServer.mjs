import redis from 'redis';

const CHANNELS = {
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION: 'TRANSACTION',
};

export default class RedisServer {
  constructor({ blockchain, transactionPool, wallet }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;

    // Create separate Redis clients for publisher and subscriber
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    // Handle errors on Redis clients
    this.publisher.on('error', (err) => {
      console.error('Redis publisher error:', err);
    });
    this.subscriber.on('error', (err) => {
      console.error('Redis subscriber error:', err);
    });

    this.loadChannels();

    this.subscriber.on('message', (channel, message) =>
      this.messageHandler(channel, message),
    );
  }

  broadcast() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }

  broadcastTransaction(transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction),
    });
  }

  loadChannels() {
    Object.values(CHANNELS).forEach((channel) =>
      this.subscriber.subscribe(channel),
    );
  }

  messageHandler(channel, message) {
    const msg = JSON.parse(message);

    if (channel === CHANNELS.BLOCKCHAIN) {
      console.log('Received blockchain message');
      this.blockchain.replaceChain(msg, true, () => {
        this.transactionPool.clearBlockTransactions({ chain: msg });
      });
    }

    if (channel === CHANNELS.TRANSACTION) {
      if (
        !this.transactionPool.transactionExists({
          address: this.wallet.publicKey,
        })
      ) {
        this.transactionPool.addTransaction(msg);
      }
    }
  }

  publish({ channel, message }) {
    this.publisher.publish(channel, message);
  }
}
