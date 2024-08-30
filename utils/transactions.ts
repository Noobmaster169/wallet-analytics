import moment from "moment";

export const convertBlockTime = (blockTime:number)=>{
    return moment.unix(blockTime).format("YYYY-MM-DD HH:mm:ss")
}