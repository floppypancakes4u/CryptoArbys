import { get, request } from "./auth.js"

export async function GetOrderBook(symbol, limit) {
    const data = {symbol, limit};
    return get("/api/v3/depth", data, DB.APIPublicKey, DB.APISecretKey).then(result => { 
        //console.log(result)
      })
}