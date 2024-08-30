"use client";

import dynamic from 'next/dynamic'; 
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import NavBar from "../components/Navbar";
import WalletInfo from "../components/WalletInfo";

import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import { clusterApiUrl, Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import React, { useState, useRef, use, useEffect, useMemo, JSXElementConstructor} from 'react';


const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);
 
export default function Home() {
  const wallet = useAnchorWallet();
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
  return (
    <>
    <div className="pb-10">
      <div className="w-screen flex flex-col items-center justify-center h-2/3">
        <NavBar />
        <WalletInfo/>
      </div>
    </div>
    </>
  );
}