import { PublicKey } from "@solana/web3.js"

import BufferLayout from "buffer-layout"

const OracleLayout = BufferLayout.struct([
  BufferLayout.blob(8, "nextSubmitTime"),
  BufferLayout.blob(32, "description"),
  BufferLayout.u8("isInitialized"),
  BufferLayout.blob(8, "withdrawable"),
  BufferLayout.blob(32, "aggregator"),
  BufferLayout.blob(32, "owner"),
])

function buff2number(buf: Uint8Array): number {
  const buffer = new Uint8Array(buf).buffer
  return new Uint32Array(buffer)[0]
}

export default function (accountInfo) {
  const data = Buffer.from(accountInfo.data)

  const oracle = OracleLayout.decode(data)

  oracle.nextSubmitTime = buff2number(oracle.nextSubmitTime)
  oracle.description = oracle.description.toString()
  oracle.isInitialized = oracle.isInitialized != 0
  oracle.withdrawable = buff2number(oracle.withdrawable)
  oracle.aggregator = new PublicKey(oracle.aggregator).toBase58()
  oracle.owner = new PublicKey(oracle.owner).toBase58()

  return oracle
}