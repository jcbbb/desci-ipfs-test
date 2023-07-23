// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { strings } from '@helia/strings';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { kadDHT } from '@libp2p/kad-dht';
import { createLibp2p } from 'libp2p';
import { tcp } from "@libp2p/tcp";
import { createHelia } from 'helia';
import { ipns, ipnsValidator, ipnsSelector } from '@helia/ipns';
import { dht, pubsub } from '@helia/ipns/routing';
import { unixfs } from '@helia/unixfs';
import { dagCbor } from "@helia/dag-cbor";

let helia = await createHelia();
let name = ipns(helia);

let strfs = strings(helia);
let cborfs = dagCbor(helia);
let keyinfo = await helia.libp2p.keychain.createKey("my-key", "RSA");
let peerId = await helia.libp2p.keychain.exportPeerId(keyinfo.name);

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
    insertData(req, res);
    // Process a POST request
  } else {
    // Handle any other HTTP method
    retrieveData(req, res);
  }
}

const insertData = async (req: NextApiRequest, res: NextApiResponse) => {
  let { content } = req.body;
  let cid = await name.resolve(peerId).catch(console.error)
  if (!cid) cid = await cborfs.add([]);

  let data = await cborfs.get(cid);
  let strcontent = await strfs.add(content);
  data.push({ cid: strcontent.toString(), content })
  const result = await cborfs.add(data);

  await name.publish(peerId, result);
  res.status(201).json({ cid: strcontent.toString(), content });
}

const retrieveData = async (
  req: NextApiRequest,
  res: NextApiResponse<BasicIpfsData>
) => {
  let existingCid = await name.resolve(peerId).catch(console.error)
  let notes = []
  if (existingCid) {
    notes = await cborfs.get(existingCid);
  }
  res.status(200).json(notes);
};
