import {
  VerificationLevel,
  IDKitWidget,
  ISuccessResult,
} from "@worldcoin/idkit";
import type { VerifyReply } from "./api/verify";
import { useState } from "react";
import Link from "next/link";
// Import viem transport, viem chain, and ENSjs
import { http } from "viem";
import { mainnet } from "viem/chains";
import { createEnsPublicClient } from "@ensdomains/ensjs";

export default function Home() {
  const [miners, setMiners] = useState<Miner[]>([]);
  const [address, setAddress] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [wallet, setWallet] = useState<string>("");

  if (!process.env.NEXT_PUBLIC_WLD_APP_ID) {
    throw new Error("app_id is not set in environment variables!");
  }
  if (!process.env.NEXT_PUBLIC_WLD_ACTION) {
    throw new Error("app_id is not set in environment variables!");
  }

  type Miner = {
    id: number;
    create_time: Date;
    address: string;
    nullifier_hash: string;
  };

  // Create the client
  const client = createEnsPublicClient({
    chain: mainnet,
    transport: http(),
  });

  const checkAddressOrENS = async (name: string) => {
    const ensRegex = /^([a-z0-9]+\.)+(eth|xyz)$/;
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;

    if (ensRegex.test(name)) {
      const address = await client.getAddressRecord({ name });
      //console.log("address",address?.value)
      return address?.value;
    } else if (addressRegex.test(name)) {
      return name;
    } else {
      return "Wrong syntaxis";
    }
  };

  const verifyMiner = async (nullifier_hash: any) => {
    const response = await fetch("/api/verifyMiner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nullifier_hash }),
    });

    if (!response.ok) {
      throw new Error("Something went wrong.");
    }

    const data = await response.json();
    if (data.message) {
      setMessage(data.message);
      console.log("Message is:" + message);
    } else {
      const walletAddress = data;
      setWallet(walletAddress);
      console.log("Wallet address:" + walletAddress);
      try {
        console.log("Sending request to server...");
        const response = await fetch("http://127.0.0.1:8080", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address: walletAddress }),
        });
        console.log("Response:", response);

        if (response.ok) {
          const transactionData = await response.json();
          console.log("Transaction data:", transactionData);
        } else {
          console.error("Error from server:", response.statusText);
        }
      } catch (error) {
        console.error("Error sending request to server:", error);
      }
    }
  };

  const onSuccessVerify = async (result: ISuccessResult) => {
    verifyMiner(result.nullifier_hash);
  };

  const handleProof = async (result: ISuccessResult) => {
    //console.log("Proof received from IDKit:\n", JSON.stringify(result)); // Log the proof from IDKit to the console for visibility
    const reqBody = {
      merkle_root: result.merkle_root,
      nullifier_hash: result.nullifier_hash,
      proof: result.proof,
      verification_level: result.verification_level,
      action: process.env.NEXT_PUBLIC_WLD_ACTION,
      signal: "",
    };
    //console.log("Sending proof to backend for verification:\n", JSON.stringify(reqBody)) // Log the proof being sent to our backend for visibility
    const res: Response = await fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });
    const data: VerifyReply = await res.json();
    if (res.status == 200) {
      console.log("It's all good man");
      //console.log("Successful response from backend:\n", data); // Log the response from our backend for visibility
    } else {
      throw new Error(
        `Error code ${res.status} (${data.code}): ${data.detail}` ??
          "Unknown error."
      ); // Throw an error if verification fails
    }
  };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <img src="https://i.ibb.co/1T3Jd3m/banner.jpg" alt="Motema Banner" />
                <div>
                    <Link href="/" style={{ display: 'inline-block', margin: '10px', padding: '10px', backgroundColor: '#0070f3', color: '#fff', borderRadius: '5px', textDecoration: 'none' }}>Home</Link>
                    <Link href="/create-miner" style={{ display: 'inline-block', margin: '10px', padding: '10px', backgroundColor: '#0070f3', color: '#fff', borderRadius: '5px', textDecoration: 'none' }}>Create Miner</Link>
                    <Link href="/verify-miner" style={{ display: 'inline-block', margin: '10px', padding: '10px', backgroundColor: '#0070f3', color: '#fff', borderRadius: '5px', textDecoration: 'none' }}>Verify Miner</Link>
                </div>
            </div>
            <div>
                <div className="flex flex-col items-center justify-center align-middle">
                    <p className="text-2xl mb-5">Miner verification page</p>
                    <IDKitWidget
                        action={process.env.NEXT_PUBLIC_WLD_ACTION!}
                        app_id={process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`}
                        onSuccess={onSuccessVerify}
                        handleVerify={handleProof}
                        verification_level={VerificationLevel.Device} // Change this to VerificationLevel.Device to accept Orb- and Device-verified users
                    >
                        {({ open }) =>
                            <button onClick={open} style={{ display: 'inline-block', margin: '10px', padding: '10px', backgroundColor: '#0070f3', color: '#fff', borderRadius: '5px', textDecoration: 'none' }}>
                                <div>Verify Miner</div>
                            </button>
                        }
                    </IDKitWidget>
                </div>

            </div>
        </>
    );
}
