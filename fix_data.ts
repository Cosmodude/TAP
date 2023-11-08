import * as fs from 'fs';

const inputFile = 'input.txt'; // Replace with your input file path
const outputFile = 'output.txt'; // Replace with your desired output file path

const lines = fs.readFileSync(inputFile, 'utf8').split('\n');
const outputData = [];

let address = '';
let links = [];

for (const line of lines) {
  if (line.startsWith('https://')) {
    // If the line is a link, add it to the links array
    links.push(line.replace(/"/g, '').trim());
  } else {
    // If the line is not a link, it's an address
    if (address !== '') {
      // If we've already collected an address, combine it with the links
      const combinedLine = address + '\t' + links.join(', ');
      outputData.push(combinedLine);

      // Clear the address and links arrays for the next entry
      address = '';
      links = [];
    }

    address = line.replace(/"/g, '').trim();
  }
}

// Write the processed data to the output file
fs.writeFileSync(outputFile, outputData.join('\n'));

console.log('Processing completed.');
