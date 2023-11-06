import { Address, toNano } from 'ton-core';
import { NetworkProvider, sleep } from '@ton-community/blueprint';
import { SbtCollection } from '../wrappers/SbtCollection';
import { CreateJsonsGetAddreses } from '../createSBTContent';
import { storeItemsMetadata } from './storeItemsMetadataIPFS';


let myAddress: Address = Address.parse("kQAXUIBw-EDVtnCxd65Z2M21KTDr07RoBL6BYf-TBCd6dTBu");




export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Collection address'));
    
    const sbtCollection = provider.open(SbtCollection.createFromAddress(address));

    const mint = await sbtCollection.sendBatchMintSbt(provider.sender(),{
        value: toNano("0.03"),  // 0.015 for gas ~ 0.02
        amount: toNano("0.014"),  // for gas + 0.01 of storage (usually 0.05)
        itemOwnerAddresses: [myAddress, myAddress],
        itemsContent:["https://raw.githubusercontent.com/TonAttendanceProtocol/Smart_Contracts/main/sampleItemMetadata.json", "https://raw.githubusercontent.com/TonAttendanceProtocol/Smart_Contracts/main/sampleItemMetadata.json"],
        authorityAddress: myAddress,
        queryId: Date.now()
    });

    ui.write('SBT Item deployed');
}