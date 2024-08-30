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

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

export default function WalletInfo() {
    const connection = new Connection("https://solana-mainnet.g.alchemy.com/v2/oeNnUfr7Hd7_6FP8bkciJLc4LhVh1HSO");
    //const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState<number>(0);
    const [signatures, setSignatures] = useState<any>([]);
    const [txData, setTxData] = useState<any>([])
    const [copied, setCopied] = useState(true);
    const [loadingTransaction, setLoadingTransaction] = useState(true);
   
    const convertBlockDate = (blockTime:number)=>{
        return moment.unix(blockTime).format("YYYY-MM-DD")
    }

    async function getAccounts(){
        console.log("Fetching Program Accounts");
        if(!publicKey){return}
        try{
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
                programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
            });
            tokenAccounts.value.forEach((accountInfo) => {
                console.log("Token Account:", accountInfo.pubkey.toBase58());
                console.log("Token Account Data:", accountInfo.account.data);
            });
        }catch(error){
            console.log("Error:", error);
        }
    }

    async function addTransactions(signatures:any){
        let transactions = []
        let prevDate = ""
        for(let i=0; i<signatures.length; i++){
            const item = signatures[i];
            const tx:any = await connection.getTransaction(item.signature, {maxSupportedTransactionVersion: 0});
            //console.log(tx);
            
            const balanceChange = []
            // Keep Track of Solana Token Activity
            if(tx.transaction.message.accountKeys){
               for(let i=0; i<tx.transaction.message.accountKeys.length; i++){
                    if(tx.transaction.message.accountKeys[i].toString() == publicKey){
                        //console.log("User Address Found at index:",i)
                        if(tx.meta.postBalances[i] != tx.meta.preBalances[i]){
                            const amount = ((tx.meta.postBalances[i] - tx.meta.preBalances[i]) / LAMPORTS_PER_SOL).toFixed(7)
                            balanceChange.push({
                                amount,
                                mintAddress: "So11111111111111111111111111111111111111112"
                            })
                        }
                    }
                } 
            }else{ //For Swapping Transaction
                const preBalance = tx.meta.preBalances[0]
                const postBalance = tx.meta.postBalances[0]
                if(preBalance != postBalance){
                    const amount = (postBalance - preBalance)/LAMPORTS_PER_SOL
                    balanceChange.push({amount, mintAddress:"So11111111111111111111111111111111111111112"})
                }
            }

            // Find Token Transfer Activity
            const preTokenBalances = tx.meta.preTokenBalances;
            const postTokenBalances = tx.meta.postTokenBalances;
            for(let i=0; i<postTokenBalances.length; i++){
                if(postTokenBalances[i].owner == publicKey){
                    let postOwnerBalance = postTokenBalances[i];
                    let preOwnerBalance = null;
                    for(let j=0; j<preTokenBalances.length; j++){
                        if(preTokenBalances[i].owner == publicKey && preTokenBalances[i].mint == postOwnerBalance.mint){
                            preOwnerBalance = preTokenBalances[i]
                        }
                    }
                    if(preOwnerBalance){
                        if(preOwnerBalance.uiTokenAmount.uiAmount != postOwnerBalance.uiTokenAmount.uiAmount){
                            balanceChange.push({
                                amount: postOwnerBalance.uiTokenAmount.uiAmount - preOwnerBalance.uiTokenAmount.uiAmount,
                                mintAddress: postOwnerBalance.mint
                            })   
                        }
                    }else{
                        balanceChange.push({
                            amount: postOwnerBalance.uiTokenAmount.uiAmount,
                            mintAddress: postOwnerBalance.mint
                        });
                    }
                }
            }
            if(balanceChange.length>0){
                tx.note = balanceChange;
            }
        
            //Keep Track of Date Display    
            if(tx?.blockTime && loadingTransaction){
                let currentDate = convertBlockDate(tx.blockTime)
                if(prevDate !== currentDate){
                    prevDate = currentDate
                    tx.date = currentDate
                }
                transactions.push(tx);
            }
        }
        return transactions
    }

    async function getSignatures(){
        console.log("Getting Signatures...")
        if(publicKey){
            if(!loadingTransaction){return}
            try{
                const res = await connection.getSignaturesForAddress(new PublicKey(publicKey), /*{limit: 15}*/)
                setSignatures(res);
                const transactions = await addTransactions(res);
                if(transactions){
                    setTxData(transactions);
                }
                setLoadingTransaction(false);
            }catch(error){
                console.log("Error:", error);
            }
        }else{
            setSignatures([]);
        }
    }
  
    useEffect(() =>{
        if(publicKey){
            getSignatures();
        }
    }, [publicKey])

    useEffect(() => {
      if (publicKey) {
        (async function getBalanceEvery10Seconds() {
          try{
            const newBalance = await connection.getBalance(publicKey);
            setBalance(newBalance / LAMPORTS_PER_SOL);
          }catch(e){
            console.log(e);
          }
          setTimeout(getBalanceEvery10Seconds, 10000);
        })();
      }else{
        setBalance(0);
      }
    }, [publicKey, connection, balance]);
   
    return (
      <>
        <div className="w-screen flex justify-center items-center">
          <div className="w-11/12 md:w-10/12 h-32 md:h-48 m-8 sm:m-12 p-4 md:p-6 mb-1 sm:mb-1 bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col justify-between">
            {/*<img className="w-full h-48 object-cover" src="https://via.placeholder.com/400" alt="Sample Image">*/}
            <h3 className="text-xl md:text-3xl font-semibold text-green-400 text-center">Account Info</h3>

            <div className="flex flex-row mt-1 md:my-4 text-base sm:text-base md:text-xl">
                <div className="flex flex-col font-semibold">
                    <div className="my-1 md:my-2 flex flex-row items-center"><FaWallet className="mr-2 md:mr-4 text-green-400"/>Address</div>
                    <div className="my-1 md:my-2 flex flex-row items-center"><SiSolana  className="mr-2 md:mr-4 text-green-400"/>Balance</div>
                </div>
                <div className ="flex flex-col mx-1 md:mx-3">
                    <div className="my-1 md:my-2">:</div>
                    <div className="my-1 md:my-2">:</div>
                </div>
                <div className="text-green-400">
                    <a className ="flex flex-row items-center hover:text-green-700 font-semibold" href={`https://solscan.io/account/${publicKey?.toString()}`} target="_blank">
                        <div className="my-1 md:my-2 underline hidden sm:block">{publicKey? publicKey.toString().slice(0) : "Not Detected"}</div>
                        <div className="my-1 md:my-2 underline sm:hidden">
                            {publicKey? `${publicKey.toString().slice(0,12)}...${publicKey.toString().slice(publicKey.toString().length-10, publicKey.toString().length)}` : "Not Detected"}
                        </div>
                        <AiOutlineExport className="md:ml-2"/>   
                    </a>    
                    <div className="flex flex-row">
                        <div className="font-semibold my-1 md:my-2">{balance}</div>
                        <div className="ml-2 font-bold my-1 md:my-2">SOL</div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {publicKey? <TransactionInfo loadingTransaction={loadingTransaction} txData={txData}/>: <div className="m-3 md:m-6 bg-grey-700"><WalletMultiButtonDynamic style={{}} /></div>}
      </>
    );
  }