export const endpoints = {
  "dev": "https://devnet.solana.com",
  "testnet": "https://testnet.solana.com",
  "mainnet": "https://api.mainnet-beta.solana.com"
};

export const aggregators = [
  {
    "address": "2jReuMRoYi3pKTF8YLnZEvT2bXcw56SdBxvssrVzu41v",
    "deprecated": false
  }
];

export function toShort (key?: string): string {
  return key.substr(0, 8) + '...' + key.substr(-8);
}