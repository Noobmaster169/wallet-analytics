"use client";
import dynamic from "next/dynamic";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ConfirmedSignatureInfo, LAMPORTS_PER_SOL, PublicKey, Connection} from "@solana/web3.js";
import { JSXElementConstructor, useEffect, useState } from "react";
import { SiSolana } from "react-icons/si";
import { FaWallet } from "react-icons/fa";
import { AiOutlineExport } from "react-icons/ai";
import moment from "moment";
import TransactionInfo from "./TransactionInfo";
import { FaCopy } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
import { GrCircleQuestion } from "react-icons/gr";
import Image from "next/image";
import { Metaplex } from "@metaplex-foundation/js";

interface TokenInfoProps {
    amount: number;
    mintAddress: string;
}

export default function TokenInfo({amount, mintAddress}: TokenInfoProps){
    const connection = new Connection("https://solana-mainnet.g.alchemy.com/v2/oeNnUfr7Hd7_6FP8bkciJLc4LhVh1HSO")
    const metaplex = Metaplex.make(connection);
    const [tokenName, setTokenName] = useState("Unknown");
    const [tokenLogo, setTokenLogo] = useState<string| null>(null);

    
    const [loading, setLoading] = useState<boolean>(true);
    
    async function getMetadata(address:string){
        const mintAddress = new PublicKey(address);
        const metadataAccount = metaplex
            .nfts()
            .pdas()
            .metadata({ mint: mintAddress });
        const metadataAccountInfo = await connection.getAccountInfo(metadataAccount);
        if (metadataAccountInfo && address) {
            const token :any = await metaplex.nfts().findByMint({ mintAddress: mintAddress });
            if(token.json){
                setTokenName(token.symbol);
                setTokenLogo(token.json.image);
                setLoading(false);
                return
            }
        }
        const tokenListUrl = 'https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json';
        try{
            interface Token {
                address: string;
                symbol: string;
                name: string;
                decimals: number;
                logoURI: string;
            }
            const response = await fetch(tokenListUrl);
            const tokenList : {tokens:Token[]} = await response.json();
            const token = tokenList.tokens.find((t:Token) => t.address === address);
            if(token){
                setTokenName(token.symbol);
                setTokenLogo(token.logoURI);
                setLoading(false);
                return
            }
        }catch(e){
            console.log("Unknown Token");
        }
        setLoading(false);
    }

    useEffect(()=>{
        getMetadata(mintAddress);
    },[]);


    return(
        <>
        <div className="my-1 p-3 px-5 bg-gray-750 hover:bg-gray-700 flex flex-row items-center rounded-lg font-semibold text-lg">
            <div className="w-64 flex flex-row justify-start font-semibold">
                {
                    loading?"Loading...":
                        <>
                        {/*<div className="w-28 font-semibold p-2 flex flex-row justify-start">*/}
                            <a className="flex flew-row justify-start items-center hover:text-green-700" href={`https://solscan.io/token/${mintAddress}`} target="_blank">
                            <div className="w-16 flex flex-row justify-center items-center">{tokenLogo? <Image className="ml-2" src={tokenLogo} alt={tokenName} width="30" height="30"/> : <GrCircleQuestion width="30" height="30"/>}</div>
                            <div className="mr-2">{tokenName}</div>
                            </a>
                    
                        </> 
                }
            </div>
            <div>
                <div>{amount}</div>
            </div>
        </div>
        </>


    )



}
