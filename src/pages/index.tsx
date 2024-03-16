import { VerificationLevel, IDKitWidget } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import type { VerifyReply } from "./api/verify";
import { useEffect, useState } from 'react'


export default function Home() {
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
		// include other properties as needed
	}

	
	const addMiner = async (create_time: any, address: any, nullifier_hash: any) => {
		const response = await fetch('/api/addMiner', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ create_time, address, nullifier_hash }),
		})

		if (!response.ok) {
			throw new Error('Something went wrong.')
		}

		const data = await response.json()
		setMiners(prevMiners => [...prevMiners, data])
	}

	const [miners, setMiners] = useState<Miner[]>([])

	useEffect(() => {
		fetch('/api/miners')
			.then(response => response.json())
			.then(data => setMiners(data))
	}, [])

	const onSuccess = (result: ISuccessResult) => {
		// This is where you should perform frontend actions once a user has been verified, such as redirecting to a new page
		//window.alert("Successfully verified with World ID! Your nullifier hash is: " + result.nullifier_hash);
		console.log("result.nullifier_hash", result.nullifier_hash)
		const currentTime = new Date().toLocaleString();
		console.log("Current time:", currentTime);
		addMiner(currentTime, "0xN4d4", result.nullifier_hash);
		//

		//
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
			<div className="flex flex-col items-center justify-center align-middle h-screen">
				<p className="text-2xl mb-5">World ID Cloud Template</p>
				<IDKitWidget
					action={process.env.NEXT_PUBLIC_WLD_ACTION!}
					app_id={process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`}
					onSuccess={onSuccess}
					handleVerify={handleProof}
					verification_level={VerificationLevel.Device} // Change this to VerificationLevel.Device to accept Orb- and Device-verified users
				>
					{({ open }) =>
						<button className="border border-black rounded-md" onClick={open}>
							<div className="mx-3 my-1">Verify with World ID</div>
						</button>
					}
				</IDKitWidget>
			</div>
			<div>
				{miners.map(miner => (
					<div key={miner.id}>{miner.address}</div>
				))}
			</div>
		</div>
	);
}
