import { toNano } from 'ton-core';
import { SbtCollection } from '../wrappers/SbtCollection';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const sbtCollection = provider.open(SbtCollection.createFromConfig({}, await compile('SbtCollection')));

    await sbtCollection.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(sbtCollection.address);

    // run methods on `sbtCollection`
}
