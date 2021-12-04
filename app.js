"use strict";
exports.__esModule = true;
var export_to_csv_1 = require("export-to-csv");
var fs = require("fs");
var csvParse = require("csv-parse");
var options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: false,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false
};
var exportToCsv = new export_to_csv_1.ExportToCsv(options);
var parserSource = csvParse.parse({ delimiter: ';' }, function (err, data) {
    var csvDataSource = exportToCsv.generateCsv(data, true);
    fs.writeFileSync(__dirname + '/csv_Files/Outputs/fileSource.txt', csvDataSource);
    //console.log(data);
});
var parserProxy = csvParse.parse({ delimiter: ';' }, function (err, data) {
    var csvDataProxy = exportToCsv.generateCsv(data, true);
    fs.writeFileSync(__dirname + '/csv_Files/Outputs/fileProxy.txt', csvDataProxy);
    //  console.log(data);
});
var dataObject = fs.readFileSync(__dirname + '/csv_Files/Inputs/proxy.csv', {
    encoding: 'utf8'
}).split('\n').map(function (row) {
    return row.split(',');
});
console.log(dataObject);
console.log(dataObject[0][1]);
console.log(dataObject[0][2]);
fs.createReadStream(__dirname + '/csv_Files/Inputs/proxy.csv').pipe(parserProxy);
fs.createReadStream(__dirname + '/csv_Files/Inputs/source.csv').pipe(parserSource);
console.log('done');
