import axios, { Method } from "axios";

export default function getSubmissionValue(oracles): number {
  if (!oracles || oracles.length < 1) {
    return 0;
  }
 
  const res = oracles.reduce((a,b) => ({ submission: 1*a.submission + 1*b.submission }), {
    submission: 0
  });
  
  return res.submission / oracles.length;
}