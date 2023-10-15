import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type SbtCollectionConfig = {};

export function sbtCollectionConfigToCell(config: SbtCollectionConfig): Cell {
    return beginCell().endCell();
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
}
