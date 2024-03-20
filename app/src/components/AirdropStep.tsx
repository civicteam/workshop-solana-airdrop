'use client';
import { FC, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import { useAirdrop } from "../AirdropContext";
import { GatewayStatus, useGateway } from "@civic/solana-gateway-react";

export const AirdropStep: FC = ({  }) => {
    const wallet = useWallet();
    const { client, balance } = useAirdrop();
    const { gatewayToken } = useGateway();
    const [loading, setLoading] = useState(false);

    const airdrop = async () => {
        if (!wallet.publicKey || !gatewayToken) return;
        try {
            setLoading(true);

            console.log("Airdropping tokens");
            const txSig = await client?.claim(gatewayToken.publicKey);
            console.log("Airdrop tx sig:", txSig);
            toast.success(<a href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`} target="_blank">Airdrop
                complete. Explorer</a>);
        } catch (e) {
            toast.error("Airdrop failed: " + (e as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center">
            <div className="flex h-12 items-center">Balance: {balance ?? 0}</div>
            <button className="btn btn-primary" onClick={airdrop}>
                Airdrop
                {loading && <span className="loading loading-spinner loading-sm"></span>}
            </button>
        </div>
    )
}