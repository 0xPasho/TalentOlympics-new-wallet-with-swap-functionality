import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
//import idl from "./idl.json"; // Assuming you have the IDL JSON file

const network = "https://api.devnet.solana.com";
const connection = new Connection(network, "processed");

const getProvider = () => {
  const provider = new AnchorProvider(connection, window.solana, {
    preflightCommitment: "processed",
  });
  return provider;
};

const getProgram = async () => {
  const provider = getProvider();
  const programId = new PublicKey(
    "5PaZ14Gw9KK1YUKaKgp2mGJ2bkbaCMKCRFEUYC9QPNRH",
  );
  const idl = {};
  const program = new Program(idl, programId, provider);
  return program;
};

export { getProvider, getProgram };
