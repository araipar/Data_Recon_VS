import { Console } from 'console';
import { ExportToCsv } from 'export-to-csv';
import * as fs from 'fs';
import * as csvParse from 'csv-parse';

const options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: false,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false,
    // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
};
const exportToCsv = new ExportToCsv(options);
var parserSource = csvParse.parse({ delimiter: ';' }, function (err, data) {
    const csvDataSource = exportToCsv.generateCsv(data, true);
    fs.writeFileSync(__dirname + '/csv_Files/Outputs/fileSource.txt', csvDataSource)
//console.log(data);
});

var parserProxy = csvParse.parse({ delimiter: ';' }, function (err, data) {
    const csvDataProxy = exportToCsv.generateCsv(data, true);
    fs.writeFileSync(__dirname + '/csv_Files/Outputs/fileProxy.txt', csvDataProxy)
  //  console.log(data);
});


const dataObject = fs.readFileSync(__dirname + '/csv_Files/Inputs/proxy.csv', {
    encoding: 'utf8'
}).split('\n').map((row: string): string[] => {
    return row.split(',');
})

console.log(dataObject);
console.log(dataObject[0][1]); // [row][col]
console.log(dataObject[0][2]);


fs.createReadStream(__dirname + '/csv_Files/Inputs/proxy.csv').pipe(parserProxy);
fs.createReadStream(__dirname + '/csv_Files/Inputs/source.csv').pipe(parserSource);



console.log('done');