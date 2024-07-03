import { describe, it, expect, beforeEach, vi } from 'vitest';
import Wallet from '../models/Wallet.mjs';
import { verifySignature } from '../utilities/crypto-lib.mjs';
import { INITIAL_BALANCE } from '../utilities/settings.mjs';
import Blockchain from '../models/Blockchain.mjs';
import Transaction from '../models/Transaction.mjs';

describe('Wallet', () => {
  let wallet;

  beforeEach(() => {
    wallet = new Wallet();
  });

  describe('Properties', () => {
    it('should have a property named balance', () => {
      expect(wallet).toHaveProperty('balance');
    });

    it('should have a property named public key', () => {
      expect(wallet).toHaveProperty('publicKey');
    });
  });

  describe('Signing process', () => {
    let data = 'test-data';

    it('should verify a signature', () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: wallet.sign(data),
        }),
      ).toBe(true);
    });

    it('should not verify a invalid signature', () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: new Wallet().sign(data),
        }),
      ).toBe(false);
    });
  });

  describe('Create transaction', () => {
    describe('and the amount is larger than the balance', () => {
      it('should throw an error', () => {
        expect(() =>
          wallet.createTransaction({
            amount: 2008,
            recipient: 'Satoshi',
          }),
        ).toThrow('Not enough funds');
      });
    });
    describe('and the amount is valid', () => {
      let transaction, amount, recipient;

      beforeEach(() => {
        amount = 25;
        recipient = 'Satoshi';
        transaction = wallet.createTransaction({ amount, recipient });
      });
      it('should create a Transaction object', () => {
        expect(transaction).toBeInstanceOf(Transaction);
      });

      it('should match the wallet inputMap', () => {
        expect(transaction.inputMap.address).toEqual(wallet.publicKey);
      });

      it('should output the amount to the recipient', () => {
        expect(transaction.outputMap[recipient]).toEqual(amount);
      });
    });

    describe('and a chain is supplied', () => {
      it('should call the Wallet.calculateBalance', () => {
        const calculateBalanceMockFn = vi.fn();

        const originalCalculateBalance = Wallet.calculateBalance;

        Wallet.calculateBalance = calculateBalanceMockFn;

        wallet.createTransaction({
          recipient: 'Satoshi',
          amount: 20,
          chain: new Blockchain(),
        });

        expect(calculateBalanceMockFn).toHaveBeenCalled();

        Wallet.calculateBalance = originalCalculateBalance;
      });
    });
  });

  describe('calculate the balance', () => {
    let blockchain;

    beforeEach(() => {
      blockchain = new Blockchain();
    });

    describe('and there is no output for the wallet', () => {
      it('should return the initial balance(starting balance)', () => {
        expect(
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          }),
        ).toEqual(INITIAL_BALANCE);
      });
    });

    describe('and there are outputs/transactions for the wallet', () => {
      let transaction_1, transaction_2;

      beforeEach(() => {
        transaction_1 = new Wallet().createTransaction({
          recipient: wallet.publicKey,
          amount: 10,
        });
        transaction_2 = new Wallet().createTransaction({
          recipient: wallet.publicKey,
          amount: 20,
        });

        blockchain.createBlock({ data: [transaction_1, transaction_2] });
      });

      it('should calculate the sum of all outputs(transactions) for the wallet', () => {
        expect(
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          }),
        ).toEqual(
          INITIAL_BALANCE +
            transaction_1.outputMap[wallet.publicKey] +
            transaction_2.outputMap[wallet.publicKey],
        );
      });

      describe('and the wallet has made a transaction', () => {
        let latestTransaction;

        beforeEach(() => {
          latestTransaction = wallet.createTransaction({
            recipient: 'Anatoly',
            amount: 25,
          });

          blockchain.createBlock({ data: [latestTransaction] });
        });

        it('should return the amount from the latest transacation', () => {
          expect(
            Wallet.calculateBalance({
              chain: blockchain.chain,
              address: wallet.publicKey,
            }),
          ).toEqual(latestTransaction.outputMap[wallet.publicKey]);
        });

        describe('and there are outputs next and after the recent transaction', () => {
          let currentBlockTransaction, nextBlockTransaction;

          beforeEach(() => {
            latestTransaction = wallet.createTransaction({
              recipient: 'Satoshi',
              amount: '35',
            });

            currentBlockTransaction = Transaction.transactionReward({
              miner: wallet,
            });

            blockchain.createBlock({
              data: [latestTransaction, currentBlockTransaction],
            });

            nextBlockTransaction = new Wallet().createTransaction({
              recipient: wallet.publicKey,
              amount: 55,
            });

            blockchain.createBlock({ data: [nextBlockTransaction] });
          });

          it('should include the amounts from the returned balance', () => {
            expect(
              Wallet.calculateBalance({
                chain: blockchain.chain,
                address: wallet.publicKey,
              }),
            ).toEqual(
              latestTransaction.outputMap[wallet.publicKey] +
                currentBlockTransaction.outputMap[wallet.publicKey] +
                nextBlockTransaction.outputMap[wallet.publicKey],
            );
          });
        });
      });
    });
  });
});
