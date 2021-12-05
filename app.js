"use strict";
exports.__esModule = true;
var export_to_csv_1 = require("export-to-csv");
var fs = require("fs");
var csvParse = require("csv-parse");
var console = require("console");
var csv = require('csvtojson'); // Make sure you have this line in order to call functions from this modules
var dateRange = "1-31 Jul 2021"; // hardcode bcs we are processing July 2021 Only
var numberOfRecordsProcessed = 0;
var numberOfDescrepancy = 0;
var typeOfDescrepancies = "";
var recordOutput = "";
var recordSummary = "";
var output = [['Amt,Descr,Date,ID,Remark']];
var summary = [['Date Range,Number Of Records Processed,Number Of Desrepancy,Type Of Desrepancy']];
var objOutput = [''];
var objSummary = [''];
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
var parserSummary = csvParse.parse({ delimiter: ';' }, function (err) {
    var csvDataSource = exportToCsv.generateCsv(summary, true);
    fs.writeFileSync(__dirname + '/csv_Files/Outputs/fileSummary.txt', csvDataSource);
    console.log(output);
});
var parserOutput = csvParse.parse({ delimiter: ';' }, function (err) {
    var csvDataProxy = exportToCsv.generateCsv(output, true);
    fs.writeFileSync(__dirname + '/csv_Files/Outputs/fileOutput.txt', csvDataProxy);
    console.log(output);
    //console.log(data);
});
var csvProxyPath = __dirname + '/csv_Files/Inputs/proxy.csv'; // Resource.csv in your case
var csvSourcePath = __dirname + '/csv_Files/Inputs/source.csv'; // Resource.csv in your case
var objProxy = csv().fromFile(csvProxyPath) // parse file proxy to json
    .then(function (jsonObjProxy) {
    csv().fromFile(csvSourcePath).then(function (jsonObjSource) {
        // console.log(jsonObjSource);
        // console.log(jsonObjProxy);
        // analyze here :   
        for (var key in jsonObjProxy) {
            if (jsonObjProxy.hasOwnProperty(key)) {
                //console.log(key + " -> " + jsonObjProxy[key]["ID"]);
                var recordId = jsonObjSource.filter(function (item) {
                    return item.ID == jsonObjProxy[key]["ID"];
                });
                numberOfRecordsProcessed += 1;
                if (Object.keys(recordId).length == 0) { //ID not exist in source
                    recordOutput = jsonObjProxy[key]["Amt"] + ',' + jsonObjProxy[key]["Descr"] + ',' + jsonObjProxy[key]["Date"] + ',' + jsonObjProxy[key]["ID"] + ',' + "Record does not exist in Source";
                    objOutput = [recordOutput];
                    output.push(objOutput);
                    numberOfDescrepancy += 1;
                    typeOfDescrepancies += '&' + 'nonExist';
                }
                else { // ID exist in source
                    recordOutput = jsonObjProxy[key]["Amt"] + ',' + jsonObjProxy[key]["Descr"] + ',' + jsonObjProxy[key]["Date"] + ',' + jsonObjProxy[key]["ID"] + ',' + "Record exist in Source";
                    objOutput = [recordOutput];
                    output.push(objOutput);
                }
            }
        }
        recordSummary = dateRange + ',' + numberOfRecordsProcessed + ',' + numberOfDescrepancy + ',' + typeOfDescrepancies;
        objSummary = [recordSummary];
        summary.push(objSummary);
        fs.createReadStream(__dirname + '/csv_Files/Inputs/source.csv').pipe(parserOutput);
        fs.createReadStream(__dirname + '/csv_Files/Inputs/source.csv').pipe(parserSummary);
    });
});
/*fs.createReadStream(__dirname + '/csv_Files/Inputs/source.csv').pipe(parserSource);*/
console.log('done');
