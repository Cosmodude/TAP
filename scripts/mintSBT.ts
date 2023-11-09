import { Address, toNano } from 'ton-core';
import { NetworkProvider, sleep } from '@ton-community/blueprint';
import { SbtCollection } from '../wrappers/SbtCollection';

let myAddress: Address = Address.parse("kQAXUIBw-EDVtnCxd65Z2M21KTDr07RoBL6BYf-TBCd6dTBu");
let MykhailAddress: Address= Address.parse("EQDZs07tyhl9NBZrwOT0acA0ex4oelR1gEpERBObgYQx7wl_");

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Collection address'));
    

    const sbtCollection = provider.open(SbtCollection.createFromAddress(address));

    const mint = await sbtCollection.sendMintSbt(provider.sender(),{
        value: toNano("0.032"),  // 0.018 for gas ~ 0.02
        amount: toNano("0.014"),  // for gas + 0.01 of storage (usually 0.05)
        itemIndex: 0,// needs to be deleted 
        itemOwnerAddress: myAddress,
        itemContent: "https://raw.githubusercontent.com/Cosmodude/TAP/main/sampleItemMetadata.json",
        authorityAddress: myAddress,
        queryId: Date.now()
    });

    ui.write('SBT Item deployed');
}