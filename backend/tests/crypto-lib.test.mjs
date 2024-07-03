import { describe, it, expect, beforeEach } from 'vitest';
import { createHash } from '../utilities/crypto-lib.mjs';

describe('Hashing', () => {
  it('should produce a hash with supplied arguments', () => {
    expect(createHash('monero', 'bitcoin')).toEqual(
      createHash('monero', 'bitcoin'),
    );
  });
  it('should produce a hash with supplied arguments in any order', () => {
    expect(createHash('monero', 'bitcoin')).toEqual(
      createHash('bitcoin', 'monero'),
    );
  });

  it('should create a unique hash when any property has changed', () => {
    const obj = {};
    const orginalHash = createHash(obj);
    obj['name'] = 'CORRUPT';

    expect(createHash(obj)).not.toEqual(orginalHash);
  });
});
