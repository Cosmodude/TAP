import * as fs from 'fs';
import * as path from 'path';
import { Address } from 'ton-core';


// Define the input and output file paths
const inputFilePath = 'input.txt';
const outputFolderPath = 'HackTonBerFestSbt';
const addressesFilePath = 'HackTonBerFestSbt/addresses.txt';

export async function CreateJsonsGetAddreses(): Promise<Address[]>{
    // Create the output folder if it doesn't exist
    if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath);
    }

    // Function to generate JSON content based on the provided link
    function generateJson(link: string) {
    return {
        name: 'Hack-TON-Berfest 2023 Winner',
        description: `Reward for contributions: ${link}`,
        image: 'ipfs://bafybeih47llh4rvifrj6dk2ncsysbg3bhffkybdfw673lhehycvtkwjsrm',
        content_url: 'ipfs://bafybeicttdff7w4ejcxfumkolc6mzzd6leif7mxas3upnb3uw5xw7cxxha',
        content_type: 'video/mp4',
        social_links: link,
    };
    }

    // Read the input file and process each line
    const inputLines = fs.readFileSync(inputFilePath, 'utf-8').split('\n');
    const addresses: Address[] = [];

    for (const line of inputLines) {
    const [address, link] = line.trim().split(',');
    if (address && link) {
        // Create a JSON file for each address
        addresses.push(Address.parse(address));
        const jsonContent = generateJson(link);
        const jsonFilePath = path.join(outputFolderPath, `${address}.json`);
        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonContent, null, 4));
    }
    }

    // Write all addresses to a file
    fs.writeFileSync(addressesFilePath, addresses.join('\n'));

    console.log('JSON files created in the output folder, and addresses file created.')
    return addresses;
}