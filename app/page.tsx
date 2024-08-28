"use client";

import dynamic from 'next/dynamic'; 
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

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
    <div className="navbar flex justify-between">
      <div className="headerContainer">
        <h1 className="header">My Blink DApp</h1>
      </div>
      <div className="headerContainer walletButton">
        <WalletMultiButtonDynamic style={{background:"#222222"}} />
      </div>
    </div>
    <main className="flex flex-col items-center justify-start min-h-screen">
      <div>Hello World!</div>
    </main>
    </>
  );
}