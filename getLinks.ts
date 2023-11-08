import * as fs from 'fs';

const filePath = 'links.txt'; // Replace with the path to your links file

function readLinksFromFile(filePath: string): string[][] {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const groups = data.split('"\n"').map((group) => group.trim().split('\n'));
    return groups.slice(0,30);
  } catch (err) {
    console.error('Error reading the file:', err);
    return [];
  }
}

const links = readLinksFromFile(filePath);
console.log(links);
