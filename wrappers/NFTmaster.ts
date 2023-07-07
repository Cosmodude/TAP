import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type NFTmasterConfig = {};

export function nFTmasterConfigToCell(config: NFTmasterConfig): Cell {
    return beginCell().endCell();
}

export class NFTmaster implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new NFTmaster(address);
    }

    static createFromConfig(config: NFTmasterConfig, code: Cell, workchain = 0) {
        const data = nFTmasterConfigToCell(config);
        const init = { code, data };
        return new NFTmaster(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
