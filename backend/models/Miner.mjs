import Transaction from './Transaction.mjs';

export default class Miner {
  constructor({ blockchain, wallet, transactionPool, pubsub }) {
    this.blockchain = blockchain;
    this.wallet = wallet;
    this.transactionPool = transactionPool;
    this.pubsub = pubsub;
  }

  mineTransaction() {
    const validTransactions = this.transactionPool.validateTransactions();
    validTransactions.push(
      Transaction.transactionReward({ miner: this.wallet })
    );
    const minedBlock = this.blockchain.createBlock({ data: validTransactions });
    this.pubsub.broadcast();
    this.transactionPool.clearTransactions();

    return minedBlock;
  }
}
