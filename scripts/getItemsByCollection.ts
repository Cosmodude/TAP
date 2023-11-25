import axios from 'axios';
import { load } from 'ts-dotenv';
import * as fs from 'fs';
import * as readline from 'readline';

const env = load({
    TONAPI_KEY: String
});

const TONAPI_URL = "https://tonapi.io/";

let collectionAddress = "EQCLjbzcWhxPyD58ZVw3dxCmk6qsqaIT4jEk2gdRBAG-iRPx";
let fileName = "";

async function fetchItemsByAddress(collectionAddress: string) {
    let data: any;

    try {
      const response = await axios.get(
        TONAPI_URL + "/v2/nfts/collections/" + collectionAddress + "/items",
        {   
            params: {
                limit: 300,
            },
            headers: {
                Authorization: 'Bearer ' + env.TONAPI_KEY,
            }
        }
      )
      data = response.data;
      //console.log(data);
      return data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
}

async function main(){
  const data = await fetchItemsByAddress(collectionAddress);
  console.log(data.nft_items[194]);
}

main()
