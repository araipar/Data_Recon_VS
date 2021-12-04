"use strict";
exports.__esModule = true;
var export_to_csv_1 = require("export-to-csv");
var fs = require("fs");
var csvParse = require("csv-parse");
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
var options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: false,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true
};
var exportToCsv = new export_to_csv_1.ExportToCsv(options);
var parserSource = csvParse.parse({ delimiter: ';' }, function (err, data) {
    var csvDataSource = exportToCsv.generateCsv(data, true);
    fs.writeFileSync(__dirname + '/csv_Files/Outputs/fileSource.txt', csvDataSource);
    console.log(data);
});
var parserProxy = csvParse.parse({ delimiter: ';' }, function (err, data) {
    var csvDataProxy = exportToCsv.generateCsv(data, true);
    fs.writeFileSync(__dirname + '/csv_Files/Outputs/fileProxy.txt', csvDataProxy);
    console.log(data);
});
fs.createReadStream(__dirname + '/csv_Files/Inputs/proxy.csv').pipe(parserProxy);
fs.createReadStream(__dirname + '/csv_Files/Inputs/source.csv').pipe(parserSource);
//const csvExporter = new ExportToCsv(options);
//const csvData = exportToCsv.generateCsv(data, true);
console.log('done');
//csvExporter.generateCsv(data);
