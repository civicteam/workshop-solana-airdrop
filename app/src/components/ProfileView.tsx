import { useAnchorWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import { CivicProfile, Profile } from "@civic/profile";
import user from "../user.jpg";
import { Connection } from "@solana/web3.js";

export const ProfileView = () => {
  const wallet = useAnchorWallet();
  const [profile, setProfile] = useState<Profile>();
  useEffect(() => {
    if (!wallet) return;
    CivicProfile.get("did:sol:" + wallet.publicKey.toString()).then(setProfile);
  }, [wallet]);

  if (!profile) return <></>;

  return <div className="pr-5 flex flex-row justify-center items-center">
    <div className="pr-5">{profile.name?.value}</div>
    <a href={"https://civic.me/" + wallet?.publicKey} target="_blank">
      <img src={profile.image?.url || user} alt="profile" className="w-12 h-12 rounded-full border-gray-400 border-2" />
    </a>
  </div>;
};