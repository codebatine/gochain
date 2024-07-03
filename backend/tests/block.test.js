import { describe, it, expect, beforeEach } from 'vitest';
import { GENESIS_DATA } from '../utilities/settings.mjs';
import dontenv from 'dotenv';
import Block from '../models/Block.mjs';
import Blockchain from '../models/Blockchain.mjs';
import { createHash } from '../utilities/crypto-lib.mjs';

dontenv.config({ path: './config/config.env' });

describe('Block', () => {
  const timestamp = Date.now();
  const hash = 'current-hash';
  const lastHash = 'previous-hash';
  const data = { amount: 3, sender: 'Mr. Monero', recipient: 'Satoshi' };
  const nonce = 512;
  const difficulty = parseInt(process.env.DIFFICULTY);
  const mineRate = parseInt(process.env.MINE_RATE);

  const block = new Block({
    timestamp,
    hash,
    lastHash,
    data,
    difficulty,
    nonce,
  });

  describe('Properties', () => {
    it('should have a timestamp property', () => {
      expect(block).toHaveProperty('timestamp');
    });
    it('should have a hash property', () => {
      expect(block).toHaveProperty('hash');
    });
    it('should have a lastHash property', () => {
      expect(block).toHaveProperty('lastHash');
    });
    it('should have a data property', () => {
      expect(block).toHaveProperty('data');
    });
    it('should have a nonce property', () => {
      expect(block).toHaveProperty('nonce');
    });
    it('should have a difficulty property', () => {
      expect(block).toHaveProperty('difficulty');
    });
  });

  describe('Property values', () => {
    it('should set a timestamp', () => {
      expect(block.timestamp).not.toEqual(undefined);
    });
    it('should set a timestamp', () => {
      expect(block.timestamp).toEqual(timestamp);
    });
    it('should have data', () => {
      expect(block.data).toEqual(data);
    });
    it('should have hash', () => {
      expect(block.hash).toEqual(hash);
    });
    it('should set the lastHash to the hash of the previous block', () => {
      expect(block.lastHash).toEqual(lastHash);
    });
    it('should have difficulty', () => {
      expect(block.difficulty).toEqual(difficulty);
    });
    it('should have nonce', () => {
      expect(block.nonce).toEqual(nonce);
    });
  });

  it('should return an instance of block', () => {
    expect(block instanceof Block).toBe(true);
  });

  describe('Methods', () => {
    describe('createGenesis() funktionen', () => {
      const genesisBlock = Block.createGenesis();

      it('should return an instance of Block class', () => {
        expect(genesisBlock instanceof Block).toBe(true);
      });

      it('should return the genesis data', () => {
        expect(genesisBlock).toEqual(GENESIS_DATA);
      });
    });

    describe('mineBlock() function', () => {
      let lastBlock, data, minedBlock;

      beforeEach(() => {
        lastBlock = Block.createGenesis();
        data = { message: 'Transaction A' };
        minedBlock = Block.mineBlock({ lastBlock, data });
      });

      it('should return a new intance of Block class', () => {
        expect(minedBlock instanceof Block).toBe(true);
      });

      it('should add a timestamp', () => {
        expect(minedBlock.timestamp).not.toBeUndefined();
      });

      it('should set the lastHash to match the lastBlock hash.', () => {
        expect(minedBlock.lastHash).toEqual(lastBlock.hash);
      });

      it('should set the data', () => {
        expect(minedBlock.data).toEqual(data);
      });

      it('should produce a hash based on correct input', () => {
        const stringToHash = minedBlock.timestamp
          .toString()
          .concat(
            minedBlock.lastHash,
            JSON.stringify(minedBlock.data),
            minedBlock.nonce,
            minedBlock.difficulty,
          );

        expect(minedBlock.hash).toEqual(createHash(stringToHash));
      });
    });

    describe('changeDifficultyLevel() function', () => {
      it('should raise the difficulty level for quickly mined block', () => {
        expect(
          Block.adjustDifficultyLevel(block, block.timestamp + mineRate - 100),
        ).toEqual(block.difficulty + 1);
      });

      it('should lower the difficulty level for slowly mined block', () => {
        expect(
          Block.adjustDifficultyLevel(block, block.timestamp + mineRate + 100),
        ).toEqual(block.difficulty - 1);
      });
    });
  });
});
