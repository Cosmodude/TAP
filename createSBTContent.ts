import { readLinksFromFile } from './getLinks';
import { readAddressesFromFile } from "./getAddreses";

const linksPath = 'links.txt';
const addressesPath = 'addresses.txt';

interface Contribution {
  name: string;
  attributes: { trait_type: string; value: string }[];
  description: string;
  image: string;
  content_url: string;
  content_type: string;
}

export async function createJsons(links: string[][], addresses: string[]){
    const contributions = links.map(lks => {

      const attributes = lks.map((link, index) => ({
        trait_type: `PR #${index + 1}`,
        value: link,
      }))
    
      const description = `Reward for contribution at \n ${lks.join(', \n ')}`;

      const contribution: Contribution = {
        name: 'Hack-TON-Berfest 2023 Winner',
        attributes,
        description,
        image: 'https://raw.githubusercontent.com/Cosmodude/TAP/main/HackTonBerFest.png',
        content_url: 'https://ipfs.io/ipfs/bafybeicttdff7w4ejcxfumkolc6mzzd6leif7mxas3upnb3uw5xw7cxxha',
        content_type: 'video/mp4',
      };

      
      return contribution;
    });
    console.log(contributions[1]);
}

createJsons(readLinksFromFile(linksPath), readAddressesFromFile(addressesPath))
