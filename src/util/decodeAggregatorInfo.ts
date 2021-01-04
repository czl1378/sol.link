import { PublicKey } from "@solana/web3.js";

import BufferLayout from "buffer-layout";

const AggregatorLayout = BufferLayout.struct([
  BufferLayout.blob(4, "submitInterval"),
  BufferLayout.blob(8, "minSubmissionValue"),
  BufferLayout.blob(8, "maxSubmissionValue"),
  BufferLayout.blob(32, "description"),
  BufferLayout.u8("isInitialized"),
  BufferLayout.blob(32, "owner"),
  BufferLayout.blob(576, "submissions"),
]);

const SubmissionLayout = BufferLayout.struct([
  BufferLayout.blob(8, "time"),
  BufferLayout.blob(8, "value"),
  BufferLayout.blob(32, "oracle"),
]);

function getMedian(submissions: any[]): number {
  const values = submissions
    .filter((s: any) => s.value != 0)
    .map((s: any) => s.value)
    .sort((a, b) => a - b)
  
  let len = values.length
  if (len == 0) {
    return 0
  } else if (len == 1) {
    return values[0]
  } else {
    let i = parseInt(len / 2 as any)
    return len % 2 == 0 ? (values[i] + values[i-1])/2 : values[i]
  }

}

function buff2number(buf: Uint8Array): number {
  const buffer = new Uint8Array(buf).buffer
  return new Uint32Array(buffer)[0]
}

export default function decodeAggregatorInfo(accountInfo: any) {
  const data = Buffer.from(accountInfo.data)
  const aggregator = AggregatorLayout.decode(data)
  
  const minSubmissionValue = buff2number(aggregator.minSubmissionValue)
  const maxSubmissionValue = buff2number(aggregator.maxSubmissionValue)
  const submitInterval = buff2number(aggregator.submitInterval)
  const description = (aggregator.description.toString() as String).trim()

  // decode oracles
  let submissions: any[] = []
  let submissionSpace = SubmissionLayout.span
  let latestUpdateTime = BigInt(0)

  for (let i = 0; i < aggregator.submissions.length / submissionSpace; i++) {
    let submission = SubmissionLayout.decode(
      aggregator.submissions.slice(i*submissionSpace, (i+1)*submissionSpace)
    )
      
    submission.oracle = new PublicKey(submission.oracle)
    submission.time = buff2number(submission.time)
    submission.value = buff2number(submission.value)
  
    if (!submission.oracle.equals(new PublicKey(0))) {
      submissions.push(submission)
    }

    if (submission.time > latestUpdateTime) {
      latestUpdateTime = submission.time
    }
  }
  
  return {
    minSubmissionValue: minSubmissionValue,
    maxSubmissionValue: maxSubmissionValue,
    submissionValue: getMedian(submissions)/100,
    submitInterval,
    description,
    oracles: submissions.map(s => s.oracle.toString()),
    latestUpdateTime,
  }
}