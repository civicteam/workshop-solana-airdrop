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

  return <div style={{ paddingTop: "10px" }}>
    <div>
      <img width={100} src={profile.image?.url || user} alt="profile" style={{
        borderRadius: "50%"
      }} />
    </div>
    <h3>{profile.name?.value}</h3>
    <a href={"https://civic.me/" + wallet?.publicKey}>View Profile</a>
  </div>;
};