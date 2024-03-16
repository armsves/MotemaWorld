import { VerificationLevel, IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import type { VerifyReply } from "./api/verify";
import { useState } from 'react'
// Import viem transport, viem chain, and ENSjs
import { http } from 'viem'
import { mainnet } from 'viem/chains'
import { createEnsPublicClient } from '@ensdomains/ensjs'
import { ethers } from 'ethers';


export default function Home() {
	const [miners, setMiners] = useState<Miner[]>([])
	const [address, setAddress] = useState<string>("");
	const [message, setMessage] = useState<string>("");

	if (!process.env.NEXT_PUBLIC_WLD_APP_ID) { throw new Error("app_id is not set in environment variables!"); }
	if (!process.env.NEXT_PUBLIC_WLD_ACTION) { throw new Error("app_id is not set in environment variables!"); }

	type Miner = {
		id: number;
		create_time: Date;
		address: string;
		nullifier_hash: string;
	}

	// Create the client
	const client = createEnsPublicClient({
		chain: mainnet,
		transport: http(),
	})

	const checkAddressOrENS = async (name: string) => {
		const ensRegex = /^([a-z0-9]+\.)+(eth|xyz)$/;
		const addressRegex = /^0x[a-fA-F0-9]{40}$/;

		if (ensRegex.test(name)) {
			const address = await client.getAddressRecord({ name })
			console.log("address",address?.value)
			return address?.value
		} else if (addressRegex.test(name)) { return name; } else {	return 'Wrong syntaxis'; }
	};

	const addMiner = async (address: any, nullifier_hash: any) => {
		const address2 = await checkAddressOrENS(address);
		console.log("Address2:", address2);
		const response = await fetch('/api/addMiner', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ address: address2, nullifier_hash }),
		});

		if (!response.ok) { throw new Error('Something went wrong.'); }

		const data = await response.json();
		setMiners(prevMiners => [...prevMiners, data]);
	}

	const onSuccess = (result: ISuccessResult) => { addMiner(address, result.nullifier_hash); };

	const verifyMiner = async (nullifier_hash: any) => {
		const response = await fetch('/api/verifyMiner', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ nullifier_hash }),
		})

		if (!response.ok) { throw new Error('Something went wrong.') }

		const data = await response.json()
		if (data.message) {
			setMessage(data.message);
			console.log("Message is:", message)
		} else {
			console.log("Wallet address:", data)
		}
	}

	const onSuccessVerify = async (result: ISuccessResult) => { verifyMiner(result.nullifier_hash); };

	const handleProof = async (result: ISuccessResult) => {
		console.log("Proof received from IDKit:\n", JSON.stringify(result)); // Log the proof from IDKit to the console for visibility
		const reqBody = {
			merkle_root: result.merkle_root,
			nullifier_hash: result.nullifier_hash,
			proof: result.proof,
			verification_level: result.verification_level,
			action: process.env.NEXT_PUBLIC_WLD_ACTION,
			signal: "",
		};
		console.log("Sending proof to backend for verification:\n", JSON.stringify(reqBody)) // Log the proof being sent to our backend for visibility
		const res: Response = await fetch("/api/verify", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(reqBody),
		})
		const data: VerifyReply = await res.json()
		if (res.status == 200) {
			console.log("Successful response from backend:\n", data); // Log the response from our backend for visibility
		} else {
			throw new Error(`Error code ${res.status} (${data.code}): ${data.detail}` ?? "Unknown error."); // Throw an error if verification fails
		}
	};

	return (
		<div>
			<div className="flex flex-col items-center justify-center align-middle ">
				<p className="text-2xl mb-5">Miner Registratrion Page</p>
				<IDKitWidget
					action={process.env.NEXT_PUBLIC_WLD_ACTION!}
					app_id={process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`}
					onSuccess={onSuccess}
					handleVerify={handleProof}
					verification_level={VerificationLevel.Device} // Change this to VerificationLevel.Device to accept Orb- and Device-verified users
				>
					{({ open }) =>
						<>
							<input type="text" size={45} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your ENS or wallet address" />
							<button className="border border-black rounded-md" onClick={open}>
								<div className="mx-3 my-1">Create Miner registry with World ID</div>
							</button>
						</>
					}
				</IDKitWidget>
			</div>



		</div>
	);
}
