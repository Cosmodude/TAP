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

async function getFileName(question: string) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.setPrompt(question);
    rl.prompt();
    return new Promise(( resolve , reject) => {

        rl.on('line', (userInput) => {
            fileName = userInput;
            rl.close();
        });

        rl.on('close', () => {
            resolve(fileName);
        });

    });
    
}

async function getCollectionAddress(question: string): Promise<string>{
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    
    rl.setPrompt(question);
    rl.prompt();
    return new Promise(( resolve , reject) => {
        
        rl.on('line', (userInput) => {
            collectionAddress = userInput;
            rl.close();
        });

        rl.on('close', () => {
            resolve(collectionAddress);
        });

    });
    
}


async function main(){
    await getFileName('Enter a fileName: ');
    await getCollectionAddress('Enter an address: ');
    
    const data = await fetchItemsByAddress(collectionAddress)
    console.log(data.nft_items.length)

    let owners: string[] = [];
    console.log(data.nft_items[0].owner.address);
    // substring(2, originalString.length - 3);
    for(let i = 0; i < data.nft_items.length; i++){
        if(data.nft_items[i].owner == undefined){
            continue
        }
        const address = data.nft_items[i].owner.address;
        owners.push(address);
        const content = owners.join(',\n');
        // Write to the file
        fs.writeFileSync("/Users/vlad/DEV/TON/TAP_contracts/TonHunt/" + fileName, content);
    }
}

main()