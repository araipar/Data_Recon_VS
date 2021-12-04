import { Console } from 'console';
import { ExportToCsv } from 'export-to-csv';
import * as fs from 'fs';
import * as csvParse from 'csv-parse';

//var data = [
//    {
//        name: 'Test 1',
//        age: 13,
//        average: 8.2,
//        approved: true,
//        description: "using 'Content hereeee, content here' "
//    },
//    {
//        name: 'Test 2',
//        age: 11,
//        average: 8.2,
//        approved: true,
//        description: "using 'Content here, content here' "
//    },
//    {
//        name: 'Test 4',
//        age: 10,
//        average: 8.2,
//        approved: true,
//        description: "using 'Content here, content here' "
//    },
//];
const options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: false,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
    // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
};
const exportToCsv = new ExportToCsv(options);
var parserSource = csvParse.parse({ delimiter: ';' }, function (err, data) {
    const csvDataSource = exportToCsv.generateCsv(data, true);
    fs.writeFileSync(__dirname + '/csv_Files/Outputs/fileSource.txt', csvDataSource)
    console.log(data);
});

var parserProxy = csvParse.parse({ delimiter: ';' }, function (err, data) {
    const csvDataProxy = exportToCsv.generateCsv(data, true);
    fs.writeFileSync(__dirname + '/csv_Files/Outputs/fileProxy.txt', csvDataProxy)
    console.log(data);
});

fs.createReadStream(__dirname + '/csv_Files/Inputs/proxy.csv').pipe(parserProxy);
fs.createReadStream(__dirname + '/csv_Files/Inputs/source.csv').pipe(parserSource);



console.log('done');