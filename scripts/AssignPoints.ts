import { Address, toNano, Dictionary } from 'ton-core';

console.log(Address.parse("EQCLjbzcWhxPyD58ZVw3dxCmk6qsqaIT4jEk2gdRBAG-iRPx") == Address.parse("0:8b8dbcdc5a1c4fc83e7c655c377710a693aaaca9a213e23124da07510401be89"))