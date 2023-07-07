import { toNano } from 'ton-core';
import { NFTmaster } from '../wrappers/NFTmaster';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const nFTmaster = provider.open(NFTmaster.createFromConfig({}, await compile('NFTmaster')));

    await nFTmaster.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(nFTmaster.address);

    // run methods on `nFTmaster`
}
