import PrimaryButton from "@/components/Button";
import { useWeb3 } from "@/contexts/useWeb3";
import Image from "next/image";
import { useEffect, useState } from "react";
import styled from 'styled-components';

const LeftSide = styled.div`
display: flex;
gap: 10px;
`;

export default function Home() {
    const {
        address,
        getUserAddress,
        sendCUSD,
        mintMinipayNFT,
        getNFTs,
        signTransaction,
    } = useWeb3();
    const [cUSDLoading, setCUSDLoading] = useState(false);
    const [nftLoading, setNFTLoading] = useState(false);
    const [signingLoading, setSigningLoading] = useState(false);
    const [userOwnedNFTs, setUserOwnedNFTs] = useState<string[]>([]);
    const [tx, setTx] = useState<any>(undefined);

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' }).then(async () => {
                //const tokenURIs = await getNFTs();
                //setUserOwnedNFTs(tokenURIs);
            }).catch((error: any) => {
                console.log('User rejected connection', error);
            });
        } else {
            console.log('MetaMask is not installed');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        getUserAddress().then(async () => {
            //const tokenURIs = await getNFTs();
            //setUserOwnedNFTs(tokenURIs);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function sendingCUSD() {
        if (address) {
            setSigningLoading(true);
            try {
                const poolAddress = "0x00f02f3a111D452C0DFbF576f09A4003b2F18284";
                const tx = await sendCUSD(poolAddress, "0.1");
                console.log(tx);
                //const tx = await sendCUSD(address, "0.1");
                setTx(tx);
            } catch (error) {
                console.log(error);
            } finally {
                setSigningLoading(false);
            }
        }
    }

    return (
        <div className="flex flex-col justify-center items-center" style={{
            fontFamily: 'Manrope, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
            fontWeight: 'bold',
            backgroundColor: '#FFFFFF',
            color: '#0047AB',
            padding: '5px',
            borderRadius: '0.45rem',
        }}>
            <Image
                src="/banner.jpg"
                height={87}
                width={630}
                alt="MotemaWRLD Banner"
            />
            <div className="h1">
                Welcome to MotemaWRLD Donations Page!
            </div>
            {address && (
                <>

                    <LeftSide>
                        {`${address.slice(0, 2)}...${address.slice(-4)}`}
                    </LeftSide>
                    <div>
                        <p>You just purchased iPhone 15 which contains 15 grams of cobalt!</p>
                        <p>Do you want to help reduce the impact of cobalt mining in Democratic Republic of Congo? Donate to the cause!</p>
                        <p>The money will be used to support the local communities and help them to find alternative sources of income.</p>
                        <p>You will contribute with 0.1 CELO</p>
                    </div>
                    {tx && (
                        <p className="mt-4">
                            Tx Completed:
                            <a href={`https://explorer.celo.org/alfajores/tx/${tx.transactionHash}`} target="_blank">
                                {(tx.transactionHash as string).substring(0, 6)}
                                ...
                                {(tx.transactionHash as string).substring(
                                    tx.transactionHash.length - 6,
                                    tx.transactionHash.length
                                )}
                            </a>
                        </p>
                    )}
                    <div className="p-4 mt-7">
                        <PrimaryButton
                            loading={signingLoading}
                            onClick={sendingCUSD}
                            title="Donate 0.1 cUSD"
                            widthFull
                        />
                    </div>
                </>
            )}
        </div>
    );
}
