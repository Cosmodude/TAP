import { Address, toNano } from 'ton-core';
import { NetworkProvider, sleep } from '@ton-community/blueprint';
import { SbtCollection } from '../wrappers/SbtCollection';
import { NFTStorage, File, Blob, CIDString } from 'nft.storage'
import { load } from 'ts-dotenv';
import { filesFromPaths } from 'files-from-path'

const env = load({
    NFT_STORAGE_API_KEY: String
});
const directoryPath = './HackTonBerFestSbt';

let myAddress: Address = Address.parse("kQAXUIBw-EDVtnCxd65Z2M21KTDr07RoBL6BYf-TBCd6dTBu");

function generateJson(link: string) {
    return {
        name: 'Hack-TON-Berfest 2023 Winner',
        description: `Reward for contributions: ${link}`,
        image: 'ipfs://bafybeih47llh4rvifrj6dk2ncsysbg3bhffkybdfw673lhehycvtkwjsrm',
        content_url: 'ipfs://bafybeicttdff7w4ejcxfumkolc6mzzd6leif7mxas3upnb3uw5xw7cxxha',
        content_type: 'video/mp4',
        social_links: link,
    };
}

async function storeItemMetadata(): Promise<CIDString>{
    const storage = new NFTStorage({ token: env.NFT_STORAGE_API_KEY });
    

    const files: any = await filesFromPaths(directoryPath, {
        hidden: true, // use the default of false if you want to ignore files that start with '.'
    })!!
    const cid = await storage.storeDirectory(files)
    return cid;
}


export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Collection address'));
    
    const sbtCollection = provider.open(SbtCollection.createFromAddress(address));

    const mint = await sbtCollection.sendMintSbt(provider.sender(),{
        value: toNano("0.03"),  // 0.015 for gas ~ 0.02
        amount: toNano("0.014"),  // for gas + 0.01 of storage (usually 0.05)
        itemIndex: 0,
        itemOwnerAddress: myAddress,
        itemContent: "https://raw.githubusercontent.com/TonAttendanceProtocol/Smart_Contracts/main/sampleItemMetadata.json",
        authorityAddress: myAddress,
        queryId: Date.now()
    });

    ui.write('SBT Item deployed');
}