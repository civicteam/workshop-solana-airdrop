import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { WorkshopSolanaLottery } from "../target/types/workshop_solana_lottery";

describe("workshop-solana-lottery", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.WorkshopSolanaLottery as Program<WorkshopSolanaLottery>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
