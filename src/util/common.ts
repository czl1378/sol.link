export const endpoints = {
  "dev": "https://devnet.solana.com",
  "testnet": "https://testnet.solana.com",
  "mainnet": "https://api.mainnet-beta.solana.com"
};

export const aggregators = [
  {
    "address": "3aTBom2uodyWkuVPiUkwCZ2HiFywdUx9tp7su7U2H4Nx",
    "deprecated": false
  }
];

export function toShort (key?: string): string {
  return key.substr(0, 8) + '...' + key.substr(-8);
}