// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { createHelia } from 'helia'
import { strings } from '@helia/strings'

// arbitrary response format
export type BasicIpfsData = {
  cid: string;
  content: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BasicIpfsData>
) {
  if (req.method === "POST") {
    // Process a POST request
  } else {
    // Handle any other HTTP method
    retrieveData(req, res);
  }
}

const retrieveData = async (
  req: NextApiRequest,
  res: NextApiResponse<BasicIpfsData>
) => {
  // connect to the default API address http://localhost:5001
  // call Core API methods
  const helia = await createHelia()
  const strfs = strings(helia)
  const string = "Hello world!";
  const result = await strfs.add(string);


  res.status(200).json({ cid: result.toString(), content: string });
};
