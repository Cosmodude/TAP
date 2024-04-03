import { Address, beginCell, toNano } from '@ton/core';
import { SbtCollection } from '../wrappers/SbtCollection';
import { compile, NetworkProvider } from '@ton/blueprint';
import { buildCollectionContentCell} from '../wrappers/contentHelpers/offchain';

let myAddress: Address = Address.parse("kQAXUIBw-EDVtnCxd65Z2M21KTDr07RoBL6BYf-TBCd6dTBu");
let end: bigint =  1964537612n; // 14.02.2024
export async function run(provider: NetworkProvider) {
    const sbtCollection = provider.open(SbtCollection.createFromConfig({
    ownerAddress: myAddress,
    mint_end: end,
    nextItemIndex: 0,
    collectionContent: buildCollectionContentCell({
        collectionContent: 'https://raw.githubusercontent.com/Cosmodude/TAP/main/Hack-Ton-Berfest_collection.json',  // collection metadata
        commonContent: ' '     // for sbt items 
    }),
    sbtItemCode: await compile("SbtItem"),
    royaltyParams: {
        royaltyFactor: Math.floor(Math.random() * 100),
        royaltyBase: 100,
        royaltyAddress: myAddress
    }
    },await compile('SbtCollection')));

    await sbtCollection.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(sbtCollection.address);

    // run methods on `sbtCollection`
}
