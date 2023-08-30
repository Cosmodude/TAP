import { Address, toNano } from 'ton-core';
import { NftCollection } from '../wrappers/NftCollection';
import { NetworkProvider, sleep } from '@ton-community/blueprint';

let myAddress: Address = Address.parse("kQAXUIBw-EDVtnCxd65Z2M21KTDr07RoBL6BYf-TBCd6dTBu");

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Collection address'));
    

    const nftCollection = provider.open(NftCollection.createFromAddress(address));

    const mint = await nftCollection.sendMintNft(provider.sender(),{
        value: toNano("1"),  // 0.015 for gas ~ 0.02
        amount: toNano("0.014"),  // for gas + 0.01 of storage (usually 0.05)
        itemIndex: 0,
        itemOwnerAddress: myAddress,
        itemContent: "https://raw.githubusercontent.com/TonAttendanceProtocol/Smart_Contracts/main/sampleItemMetadata.json",
        queryId: Date.now()
    });

    ui.write('NFT Item deployed');
}