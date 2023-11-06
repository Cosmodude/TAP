import { NFTStorage, File, Blob, CIDString } from 'nft.storage'
import { load } from 'ts-dotenv';
import { filesFromPaths } from 'files-from-path'
const env = load({
    NFT_STORAGE_API_KEY: String
});
const directoryPath = '/Users/vlad/DEV/TON/TAP_contracts/HackTonBerFestSbt';

export async function storeItemsMetadata(): Promise<CIDString>{
    const storage = new NFTStorage({ token: env.NFT_STORAGE_API_KEY });

    const files: any = await filesFromPaths(directoryPath, {
        hidden: true, // use the default of false if you want to ignore files that start with '.'
    })!!
    const cid = await storage.storeDirectory(files)
    return cid;
}

storeItemsMetadata().then( cid => console.log(cid))