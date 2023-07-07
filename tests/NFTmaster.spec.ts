import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { NFTmaster } from '../wrappers/NFTmaster';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('NFTmaster', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('NFTmaster');
    });

    let blockchain: Blockchain;
    let nFTmaster: SandboxContract<NFTmaster>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        nFTmaster = blockchain.openContract(NFTmaster.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await nFTmaster.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: nFTmaster.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and nFTmaster are ready to use
    });
});
