"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const export_to_csv_1 = require("export-to-csv");
const fs = require("fs");
const csvParse = require("csv-parse");
var data = [
    {
        name: 'Test 1',
        age: 13,
        average: 8.2,
        approved: true,
        description: "using 'Content hereeee, content here' "
    },
    {
        name: 'Test 2',
        age: 11,
        average: 8.2,
        approved: true,
        description: "using 'Content here, content here' "
    },
    {
        name: 'Test 4',
        age: 10,
        average: 8.2,
        approved: true,
        description: "using 'Content here, content here' "
    },
];
var parser = csvParse.parse({ delimiter: ';' }, function (err, data) {
    console.log(data);
});
fs.createReadStream(__dirname + '/csv_Files/Outputs/proxy.csv').pipe(parser);
const options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: false,
    title: 'My Awesome CSV',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
    // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
};
//const csvExporter = new ExportToCsv(options);
const exportToCsv = new export_to_csv_1.ExportToCsv(options);
const csvData = exportToCsv.generateCsv(data, true);
fs.writeFileSync(__dirname + '/csv_Files/file.txt', csvData);
console.log('done');
//csvExporter.generateCsv(data);
//# sourceMappingURL=app.js.map