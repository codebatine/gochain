import { describe, it, expect, beforeEach } from 'vitest';
import Transaction from '../models/Transaction.mjs';
import Wallet from '../models/Wallet.mjs';
import TransactionPool from '../models/TransactionPool.mjs';
import Blockchain from '../models/Blockchain.mjs';

describe('TransactionPool', () => {
  let transactionPool, transaction, sender;

  sender = new Wallet();

  beforeEach(() => {
    transaction = new Transaction({
      sender,
      receipient: 'Satoshi',
      amount: 20,
    });

    transactionPool = new TransactionPool();
  });

  describe('properties', () => {
    it('should have a property named transactionMap', () => {
      expect(transactionPool).toHaveProperty('transactionMap');
    });
  });

  describe('addTransaction()', () => {
    it('should add a transaction to the transaction pool', () => {
      transactionPool.addTransaction(transaction);

      expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
    });
  });

  describe('transactionExist()', () => {
    it('should return a transaction based on its address', () => {
      transactionPool.addTransaction(transaction);

      expect(
        transactionPool.transactionExist({ address: sender.publicKey }),
      ).toBe(transaction);
    });
  });

  describe('validTransation method', () => {
    let transactions;

    beforeEach(() => {
      transactions = [];

      for (let i = 0; i < 10; i++) {
        transaction = new Transaction({
          sender,
          recipient: 'Satoshi',
          amount: 55,
        });

        if (i % 3 === 0) {
          transaction.inputMap.amount = 1010;
        } else if (i % 3 === 1) {
          transaction.inputMap.signature = new Wallet().sign('CORRUPT');
        } else {
          transactions.push(transaction);
        }

        transactionPool.addTransaction(transaction);
      }
    });

    it('should return valid transactions', () => {
      expect(transactionPool.validateTransactions()).toStrictEqual(
        transactions,
      );
    });
  });

  /// The risky test part?
  describe('clearTransaction method', () => {
    it('should clear the transactionPool', () => {
      transactionPool.clearTransactions();
      expect(transactionPool.transactionMap).toEqual({});
    });
  });

  describe('clearBlockTransactions method', () => {
    it('should clear the pool of existing blockchain transactions', () => {
      const blockchain = new Blockchain();

      const expectedMap = {};

      for (let i = 0; i < 20; i++) {
        const transaction = new Wallet().createTransaction({
          recipient: 'Satoshi',
          amount: 5,
        });

        transactionPool.addTransaction(transaction);

        if (i % 2 === 0) {
          blockchain.createBlock({ data: [transaction] });
        } else {
          expectedMap[transaction.id] = transaction;
        }
      }

      transactionPool.clearBlockTransactions({ chain: blockchain.chain });

      expect(transactionPool.transactionMap).toEqual(expectedMap);
    });
  });
});
