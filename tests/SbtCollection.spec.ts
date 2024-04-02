import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano, Address } from '@ton/core';
import { SbtCollection } from '../wrappers/SbtCollection';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';
import { buildCollectionContentCell} from '../wrappers/contentHelpers/offchain';

let myAddress: Address = Address.parse("kQAXUIBw-EDVtnCxd65Z2M21KTDr07RoBL6BYf-TBCd6dTBu");

describe('SbtCollection', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('SbtCollection');
    });

    let blockchain: Blockchain;
    let sbtCollection: SandboxContract<SbtCollection>;
    let deployer: SandboxContract<TreasuryContract>;
    let user: SandboxContract<TreasuryContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        user = await blockchain.treasury('user');

        sbtCollection = await blockchain.openContract(SbtCollection.createFromConfig({
            ownerAddress: deployer.address,
            mint_end: 1712705479n,
            nextItemIndex: 0,
            collectionContent: buildCollectionContentCell({
                collectionContent: 'https://raw.githubusercontent.com/TonAttendanceProtocol/Smart_Contracts/main/sampleCollectionMetadata.json',  // collection metadata
                commonContent: ' '     // for sbt items 
            }),
            sbtItemCode: await compile("SbtItem"),
            royaltyParams:{
                royaltyFactor: 15,
                royaltyBase: 100,
                royaltyAddress: deployer.address
            }
        }, code));

        const deployResult = await sbtCollection.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: sbtCollection.address,
            deploy: true,
            success: true,
        });
        //console.log(deployResult.events)

        const data = await sbtCollection.getCollectionData();
        expect(data.ownerAddress).toEqualAddress(deployer.address);
        expect(data.nextItemIndex).toEqual(0);
        //console.log(data)
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and sbtCollection are ready to use
    });

    it('should mint SBT item', async () => {

        const mint = await sbtCollection.sendMintItem(deployer.getSender(), {
            value: toNano("0.5"),  // 0.015 for gas ~ 0.02
            amount: toNano("0.014"),  // for gas + 0.01 of storage (usually 0.05)
            itemIndex: 0,
            itemOwnerAddress: user.address,
            itemContent: "https://raw.githubusercontent.com/TonAttendanceProtocol/Smart_Contracts/main/sampleItemMetadata.json",
            authorityAddress: myAddress,
            queryId: Date.now()
        });
        expect(mint.events.at(-1)?.type).toMatch("account_created");
        const data = await sbtCollection.getCollectionData();
        expect(data.ownerAddress).toEqualAddress(deployer.address);
        expect(data.nextItemIndex).toEqual(1);
        //console.log("Mint: ", mint.events)

    });

    it('should batch mint SBT items', async () => {

        const mint = await sbtCollection.sendBatchMintSbt(deployer.getSender(), {
            value: toNano("0.014") * 2n + toNano("0.03"),  // 0.015 for gas ~ 0.02
            amount: toNano("0.014"),  // for gas + 0.01 of storage 
            itemOwnerAddresses: [user.address, user.address],
            itemsContent: ["https://raw.githubusercontent.com/TonAttendanceProtocol/Smart_Contracts/main/sampleItemMetadata.json","https://raw.githubusercontent.com/TonAttendanceProtocol/Smart_Contracts/main/sampleItemMetadata.json"], 
            authorityAddress: myAddress,
            queryId: Date.now()
        });

        const data = await sbtCollection.getCollectionData();
        expect(data.ownerAddress).toEqualAddress(deployer.address);
        expect(data.nextItemIndex).toEqual(2);
        //console.log(mint.transactions)
    })

});
