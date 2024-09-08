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
    const [loading, setLoading] = useState<boolean>(true);
    
    return(
        <>
        <div className="my-1 p-3 px-5 bg-gray-750 hover:bg-gray-700 flex flex-row items-center rounded-lg font-semibold text-lg">
            <div className="w-64 flex flex-row justify-between items-center font-semibold">
                {
                    loading?"Loading...":
                        <>
                        <div className="w-32 flex flex-row justify-center">
                            Token Amount
                            {/*txInfo.note[0].amount < 0?
                                <div className="text-red-400">- {txInfo.note[0].amount * -1}</div>:
                                <div className="text-green-400"> + {txInfo.note[0].amount}</div>
                            */}
                        </div>
                        <div className="w-28 font-semibold p-2 flex flex-row justify-end items-center">
                            Token Name & Symbol
                            {/*txInfo.note?
                                <a className="flex flew-row justify-end items-center hover:text-green-700" href={`https://solscan.io/token/${txInfo.note[0].mintAddress}`} target="_blank">
                                <div className="mr-2">{tokenName}</div>
                                <div>{tokenLogo? <Image className="ml-2" src={tokenLogo} alt={tokenName} width="30" height="30"/> : <GrCircleQuestion width="30" height="30"/>}</div>
                                </a>
                            : "-"*/}
                        </div>
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
