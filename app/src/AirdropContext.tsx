import { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { AirdropClient } from "./lib/AirdropClient";
import { PublicKey } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@coral-xyz/anchor";

type AirdropContextType = {
  client: AirdropClient | undefined;
  balance: number | null;
  createNewAirdrop: () => Promise<void>;
}
export const AirdropContext = createContext<AirdropContextType>({
  client: undefined,
  createNewAirdrop: async () => {},
  balance: null
});

const safeParsePublicKey = (string: string) => {
  try {
    return new PublicKey(string);
  } catch (e) {
    return null;
  }
};

export const AirdropProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [client, setClient] = useState<AirdropClient | undefined>();
  const [balance, setBalance] = useState<number | null>(null);
  const addressFromUrl = useMemo(
    () => safeParsePublicKey(window.location.href.split("#")[1]),
    [window.location.href]
  );

  const provider = useMemo(() => {
    if (!wallet) return undefined;

    return new AnchorProvider(
      connection,
      wallet,
      {}
    );
  }, [wallet])

  useEffect(() => {
    if (!provider || !addressFromUrl || client) return;
    AirdropClient.get(provider, addressFromUrl).then((client) => {
      setClient(client);

      if (client) {
        client.getBalance().then(setBalance);
      }
    });
  }, [addressFromUrl, provider, client]);

  const createNewAirdrop = async () => {
    if (!provider) return undefined;
    await AirdropClient.create(provider).then(client => {
      window.location.href = `#${client.airdropAddress.toString()}`;
      window.location.reload();
    });
  }

  return (
    <AirdropContext.Provider value={{ client,createNewAirdrop,balance }}>
      {children}
    </AirdropContext.Provider>
  );
}

export const useAirdrop = () => useContext(AirdropContext);