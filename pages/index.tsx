import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BasicIpfsData } from "./api/ipfs";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BasicIpfsData[]>([]);
  const [note, setNote] = useState<BasicIpfsData | null>(null);
  const [txt, setTxt] = useState("");
  const inputRef = useRef<HTMLTextareaElement>(null);

  const handleLoad = async () => {
    setLoading(true);
    const { data } = await axios.get("/api/ipfs");
    setResults(data);
    setLoading(false);
  };

  // avoiding ternary operators for classes
  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.target));
    const { data } = await axios.post("/api/ipfs", values);
    setResults((prev) => [...prev, data])
    e.target.reset();
    if (inputRef.current) inputRef.current.focus();
  }

  return (
    <>
      <Head>
        <title>IPFS Notes</title>
        <meta name="description" content="IPFS Notes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main class="max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold underline">IPFS Notes</h1>
          <div className="flex">
            <section className="max-w-lg w-full shrink-0 break-words">
              {results.map((result, idx) => (
                <div className="flex flex-col" key={idx}>
                  <span>Content: {result.content}</span>
                  <span>CID: {result.cid}</span>
                </div>
              ))}
              <div>
                <button
                  onClick={handleLoad}
                  className={classNames(
                    "bg-slate-300 hover:bg-slate-500 text-black rounded-md p-2 drop-shadow-md w-32",
                    loading ? "animate-pulse" : ""
                  )}
                >
                  {loading ? "Loading..." : "Retrieve Data"}
                </button>
              </div>
            </section>
            <section className="w-full">
              <form className="flex flex-col space-y-2 max-w-sm" onSubmit={onSubmit}>
                <textarea required minlength="1" ref={inputRef} name="content" className="border border-slate-300 p-2 text-normal"></textarea>
                <button className="bg-slate-300 hover:bg-slate-500 text-black rounded-md p-2 drop-shadow-md">Create</button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
