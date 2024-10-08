"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, Connection, Transaction } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
import { AiOutlineExport } from "react-icons/ai";
import { GrCircleQuestion } from "react-icons/gr";
import moment from "moment";
import Image from "next/image";
import { Metaplex } from "@metaplex-foundation/js";

interface TransactionInfoProps {
    loadingTransaction: boolean;
    txData: TxInfo[];
}
interface TransactionItemProps{
    txInfo: TxInfo;
}

interface TxInfo{
    slot:number;
    transaction: any;
    blockTime:number;
    meta:any;
    note: TxChange[];
}

interface TxChange{
    amount: number;
    mintAddress: string;
}

export default function TransactionInfo({loadingTransaction, txData}: TransactionInfoProps) {
    return(
    <div className="w-screen flex justify-center items-center">
        <div className="w-11/12 md:w-10/12 m-8 sm:m-12 mb-1 p-4 md:p-6 bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col justify-between">
          <h3 className="text-xl md:text-3xl text-center font-semibold text-green-400 mb-3">Transaction History</h3>
          <div className="mt-4 w-auto flex flex-col itmes-center">             
            {loadingTransaction? 
            
                <div className="flex flex-row justify-center text-2xl font-semibold my-4 mt-10">Loading...</div>: 
                txData.length >= 0?
                    <>
                        <div className="my-1 px-5 flex flex-row justify-between items-center rounded-lg font-bold text-xl">
                            {/* Transaction Data Titles */}
                            <div className="flex flex-row justify-center items-center w-20 md:w-40">
                                Tx Signature
                            </div>
                            <div className="flex flex-row justify-center items-center hidden lg:block w-36">
                                Block Number
                            </div>
                            <div className="flex flex-row justify-center text-center items-center w-48 hidden md:block">
                                Timestamp
                            </div>
                            <div className="w-64 flex flex-row justify-between items-center font-semibold">
                                <div className="w-32 flex flex-row justify-center">Amount</div>
                                <div className="w-28 flex flex-row justify-center">Token</div>
                            </div>
                        </div>   
                        {txData.map((item:any, key:any)=> 
                            <div key={key}>
                                {item.date? <div className="mx-5 mt-2 font-semibold text-gray-500 text-lg md:text-xl">{item.date}</div> : ""}
                                <TransactionItem txInfo={item}/>
                            </div>
                        )}                
                    </>
                :    
                <div className="flex flex-row justify-center text-2xl font-semibold my-4 mt-10">No Transactions Detected</div>
            }
          </div>
          </div>
      </div>)
}

function TransactionItem({txInfo}: TransactionItemProps){
    const connection = new Connection("https://solana-mainnet.g.alchemy.com/v2/oeNnUfr7Hd7_6FP8bkciJLc4LhVh1HSO")
    const metaplex = Metaplex.make(connection);
    const [copied, setCopied]= useState(false);
    const [subItem, setSubItem] = useState<any>(<></>);
    const [tokenName, setTokenName] = useState("Unknown");
    const [tokenLogo, setTokenLogo] = useState<string| null>(null);
    const [loading, setLoading] = useState(true);
      
    const convertBlockTime = (blockTime:number)=>{
        return moment.unix(blockTime).format("YYYY-MM-DD HH:mm:ss")
    }
    const copyItem = (message:string)=>{
        navigator.clipboard.writeText(message).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
          })
          .catch(err => {
            console.error("Failed to copy: ", err);
          });
    }

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
            }
        }catch(e){
            console.log("Unknown Token");
        }
        setLoading(false);
    }

    async function compileData(){
        if(txInfo.note){
            await getMetadata(txInfo.note[0].mintAddress);
            if(txInfo.note.length>1){
                addSubItem(txInfo)
            }
        }
    }

    useEffect(()=>{compileData()}, [])

    function addSubItem(txInfo:any){
        if(!txInfo.note){return}
        if(txInfo.note.length <= 1){return}
        const txInfoCopy = JSON.parse(JSON.stringify(txInfo))
        txInfoCopy.note = txInfoCopy.note.slice(1)
        setSubItem(<div className="mt-2"><TransactionItem txInfo={txInfoCopy}/></div>)
    }
    
    
    return(
    <>
    <div className="my-1 p-3 px-5 bg-gray-750 hover:bg-gray-700 flex flex-row justify-between items-center rounded-lg font-semibold text-lg">
        {/*<div className="hidden xl:block text-green-400">*/}
        <a className="text-green-400 flex flex-row items-center hover:text-green-700 w-40" href={`https://solscan.io/tx/${txInfo.transaction.signatures[0]}`} target="_blank">
            <div className="w-20 md:hidden">{`${txInfo.transaction.signatures[0].slice(0,7)}...`}</div>
            <div className="w-36 hidden md:block">{`${txInfo.transaction.signatures[0].slice(0,12)}...`}</div>
            <AiOutlineExport />
        </a>

        <a className="text-green-400 flex flex-row justify-center items-center hover:text-green-700 w-36 hidden lg:block" href={`https://solscan.io/block/${txInfo.slot}`} target="_blank">
            <div className="flex flex-row justify-center items-center">
            <div className="w-24">{txInfo.slot}</div>
            <AiOutlineExport /></div>
        </a>
        <div className="flex flex-row justify-center items-center text-center w-48 hidden md:block">
            <div>{convertBlockTime(txInfo.blockTime)}</div>
        </div>
        <div className="w-64 flex flex-row justify-between items-center font-semibold">
            {txInfo.note? 
                loading?"Loading...":
                    <>
                    <div className="w-32 flex flex-row justify-center">
                        {txInfo.note[0].amount < 0?
                            <div className="text-red-400">- {txInfo.note[0].amount * -1}</div>:
                            <div className="text-green-400"> + {txInfo.note[0].amount}</div>
                        }
                    </div>
                    <div className="w-28 font-semibold p-2 flex flex-row justify-end items-center">
                        {txInfo.note?
                            <a className="flex flew-row justify-end items-center hover:text-green-700" href={`https://solscan.io/token/${txInfo.note[0].mintAddress}`} target="_blank">
                            <div className="mr-2">{tokenName}</div>
                            <div>{tokenLogo? <Image className="ml-2" src={tokenLogo} alt={tokenName} width="30" height="30"/> : <GrCircleQuestion width="30" height="30"/>}</div>
                            </a>
                        : "-"}
                    </div>
                    </> 
            : <>
                <div className="w-32 flex flex-row justify-center">-</div>
                <div className="w-28 font-semibold p-2 flex flex-row justify-center">-</div>
              </> 
            }
        </div>
    </div>
    {subItem}
    </>)
}