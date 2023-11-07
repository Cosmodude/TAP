import * as fs from 'fs';

const filePath = 'addresses.txt'; // Replace with the path to your addresses file

function readAddressesFromFile(filePath: string): string[] {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const addresses = data.split('\n').map((line) => line.trim()).filter((line) => line !== '');
    return addresses;
  } catch (err) {
    console.error('Error reading the file:', err);
    return [];
  }
}

const addresses = readAddressesFromFile(filePath);
console.log(addresses.length);
