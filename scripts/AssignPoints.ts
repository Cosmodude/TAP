import { Address, toNano, Dictionary } from 'ton-core';
import * as fs from 'fs';

function readForm(name: string): string[] {
  const fileContent = fs.readFileSync("/Users/vlad/DEV/TON/TAP_contracts/TonHunt/" + name, 'utf-8');
  const addresses = fileContent.split('\r\n').filter((line) => line.trim() !== '');

  return addresses;
}

function readFile(name: string): string[] {
    const fileContent = fs.readFileSync("/Users/vlad/DEV/TON/TAP_contracts/TonHunt/" + name, 'utf-8');
    const addresses = fileContent.split(',\n').filter((line) => line.trim() !== '');
  
    return addresses;
  }

let form = readForm("Form");
form = [...new Set(form)];
//same result
// form = form.filter(function(item, pos, self) {
//     return self.indexOf(item) == pos;
// })
console.log(form.length);

const points: number[] = Array(form.length).fill(0);
const collections = ["Bemo", "Before", "Dedust", "Evaa", "Friends", "Redoubt", "Storm", "Tokenova", "Wallet"];
//console.log(Address.parse("EQCLjbzcWhxPyD58ZVw3dxCmk6qsqaIT4jEk2gdRBAG-iRPx").equals(Address.parse("0:8b8dbcdc5a1c4fc83e7c655c377710a693aaaca9a213e23124da07510401be89")))

for(let i =0; i< collections.length; i++){
    const badge = readFile(collections[i]);
    //console.log(badge)
    for(let j = 0; j< form.length; j++ ){
        for (let k=0; k < badge.length; k++){
            if(Address.parse(form[j]).equals(Address.parse(badge[k]))){
                points[j] += 1;
                break;
            }
        }
    }
}


let p = '';
const PointsPath = "/Users/vlad/DEV/TON/TAP_contracts/TonHunt/Points";
for(let i = 0; i < points.length; i++){
    p+= points[i];
    p+= '\n'
}
fs.writeFileSync(PointsPath, p);
console.log(points)


function writeResult() {
    let content = '';
    const filePath = "/Users/vlad/DEV/TON/TAP_contracts/TonHunt/Result";

    for (let i = 0; i < form.length; i++) {
      const address = form[i];
      const point = points[i];
      
      for (let j = 0; j < point; j++) {
        content += `${address}\n`;
      }
    }
    fs.writeFileSync(filePath, content);
}

writeResult()