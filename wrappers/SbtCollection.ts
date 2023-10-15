import { 
    Address, 
    beginCell, 
    Cell, 
    Contract, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    SendMode, 
} from 'ton-core';
import { buildCollectionContentCell, decodeOffChainContent, encodeOffChainContent } from './contentHelpers/offchain';
let myAddress: Address = Address.parse("kQAXUIBw-EDVtnCxd65Z2M21KTDr07RoBL6BYf-TBCd6dTBu");

export type RoyaltyParams = {
    royaltyFactor: number;
    royaltyBase: number;
    royaltyAddress: Address;
};

export type SbtCollectionConfig = {
    ownerAddress: Address;
    nextItemIndex: number;
    collectionContent: Cell;
    sbtItemCode: Cell;
    royaltyParams: RoyaltyParams;
};

export function sbtCollectionConfigToCell(config: SbtCollectionConfig): Cell {
    return beginCell()
        .storeAddress(config.ownerAddress)
        .storeUint(config.nextItemIndex, 64)
        .storeRef(config.collectionContent)
        .storeRef(config.sbtItemCode)
        .storeRef(
            beginCell()
                .storeUint(config.royaltyParams.royaltyFactor, 16)
                .storeUint(config.royaltyParams.royaltyBase, 16)
                .storeAddress(config.royaltyParams.royaltyAddress)
        )
        .endCell();
}

export class SbtCollection implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new SbtCollection(address);
    }

    static createFromConfig(config: SbtCollectionConfig, code: Cell, workchain = 0) {
        const data = sbtCollectionConfigToCell(config);
        const init = { code, data };
        return new SbtCollection(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendMintSbt(provider: ContractProvider, via: Sender,
        opts: {
            value: bigint;
            queryId: number;
            itemIndex: number;
            itemOwnerAddress: Address;
            itemContent: string;
            authorityAddress: Address;
            amount: bigint;
        }
        ) {
            const sbtContent = encodeOffChainContent(opts.itemContent);
            
            const sbtMessage = beginCell();
            sbtMessage.storeAddress(opts.itemOwnerAddress)
            sbtMessage.storeRef(sbtContent)
            sbtMessage.storeAddress(opts.authorityAddress)

            await provider.internal(via, {
                value: opts.value,
                sendMode: SendMode.PAY_GAS_SEPARATELY,
                body: beginCell()
                    .storeUint(1,32)  // operation
                    .storeUint(opts.queryId,64)
                    .storeUint(opts.itemIndex,64)
                    .storeCoins(opts.amount)
                    .storeRef(sbtMessage)
                .endCell()
            })
        }

    async getCollectionData(provider: ContractProvider): Promise<{nextItemId: number, ownerAddress: Address, collectionContent: string}>{
        const collectionData = await provider.get("get_collection_data", []);
        const stack = await collectionData.stack;
        let nextItem: bigint = stack.readBigNumber();
        let collectionContent: Cell = await stack.readCell();
        let ownerAddress: Address = await stack.readAddress();
        return {
            nextItemId: Number(nextItem), 
            ownerAddress: ownerAddress,
            collectionContent: decodeOffChainContent(collectionContent),
        };
    }
        
}
