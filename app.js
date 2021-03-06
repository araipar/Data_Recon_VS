"use strict";
exports.__esModule = true;
var export_to_csv_1 = require("export-to-csv");
var fs = require("fs");
var console = require("console");
var csv = require('csvtojson'); // Make sure you have this line in order to call functions from this modules
var dateStart = "";
var dateEnd = "";
var numberOfRecordsProcessed = 0;
var numberOfDescrepancy = 0;
var typeOfDescrepancies = "";
var recordOutput = "";
var recordSummary = "";
var output = [['Amt,Descr,Date,ID,Remark']];
var summary = [['Date Range|Number Of Records Processed|Number Of Desrepancy|Type Of Desrepancy']];
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
var csvProxyPath = __dirname + '/csv_Files/Inputs/proxy.csv'; //  records in our case
var csvSourcePath = __dirname + '/csv_Files/Inputs/source.csv'; // bank statment in your case
var objProxy = csv().fromFile(csvProxyPath) // parse file proxy to json
    .then(function (jsonObjProxy) {
    csv().fromFile(csvSourcePath).then(function (jsonObjSource) {
        dateStart = jsonObjProxy[0]["Date"]; //initial date
        dateEnd = jsonObjProxy[0]["Date"];
        // analyze here :   
        for (var key in jsonObjProxy) {
            if (jsonObjProxy.hasOwnProperty(key)) {
                var recordId = jsonObjSource.filter(function (item) {
                    return item.ID == jsonObjProxy[key]["ID"];
                });
                if (Date.parse(dateStart) > Date.parse(jsonObjProxy[key]["Date"])) { // getting max & min date for summary report
                    dateStart = jsonObjProxy[key]["Date"];
                }
                if (Date.parse(dateEnd) < Date.parse(jsonObjProxy[key]["Date"])) {
                    dateEnd = jsonObjProxy[key]["Date"];
                }
                numberOfRecordsProcessed += 1; // numberOfDescrepancy for summary report
                // analysis flow : check ID -> check Amount -> check Date -> check Description 
                if (Object.keys(recordId).length != 1) { //ID not exist in source or might be containing duplicate in source
                    recordOutput = jsonObjProxy[key]["Amt"] + ',' + jsonObjProxy[key]["Descr"] + ',' + jsonObjProxy[key]["Date"] + ',' + jsonObjProxy[key]["ID"] + ',' + "Record does not exist or duplicated in Source";
                    objOutput = [recordOutput];
                    output.push(objOutput);
                    numberOfDescrepancy += 1;
                    typeOfDescrepancies += 'nonExistOrDuplicate;';
                }
                else { // ID exist in source
                    var recordAmount = jsonObjSource.filter(function (item) {
                        return item.Amount == jsonObjProxy[key]["Amt"] && item.ID == jsonObjProxy[key]["ID"];
                    });
                    if (Object.keys(recordAmount).length == 0) { //cek Amountt
                        recordOutput = jsonObjProxy[key]["Amt"] + ',' + jsonObjProxy[key]["Descr"] + ',' + jsonObjProxy[key]["Date"] + ',' + jsonObjProxy[key]["ID"] + ',' + "Amount Mismatch";
                        objOutput = [recordOutput];
                        output.push(objOutput);
                        numberOfDescrepancy += 1;
                        typeOfDescrepancies += 'AmountMismatch;';
                    }
                    else {
                        var recordDate = jsonObjSource.filter(function (item) {
                            return item.Date == jsonObjProxy[key]["Date"] && item.ID == jsonObjProxy[key]["ID"];
                        });
                        if (Object.keys(recordDate).length == 0) { //cekDate
                            recordOutput = jsonObjProxy[key]["Amt"] + ',' + jsonObjProxy[key]["Descr"] + ',' + jsonObjProxy[key]["Date"] + ',' + jsonObjProxy[key]["ID"] + ',' + "Date Mismatch";
                            objOutput = [recordOutput];
                            output.push(objOutput);
                            numberOfDescrepancy += 1;
                            typeOfDescrepancies += 'DateMismatch;';
                        }
                        else {
                            var recordDesc = jsonObjSource.filter(function (item) {
                                return item.Description == jsonObjProxy[key]["Descr"] && item.ID == jsonObjProxy[key]["ID"];
                            });
                            if (Object.keys(recordDesc).length == 0) { //cekDesc
                                recordOutput = jsonObjProxy[key]["Amt"] + ',' + jsonObjProxy[key]["Descr"] + ',' + jsonObjProxy[key]["Date"] + ',' + jsonObjProxy[key]["ID"] + ',' + "Description Mismatch";
                                objOutput = [recordOutput];
                                output.push(objOutput);
                                numberOfDescrepancy += 1;
                                typeOfDescrepancies += 'DescriptionMismatch;';
                            }
                            else {
                                recordOutput = jsonObjProxy[key]["Amt"] + ',' + jsonObjProxy[key]["Descr"] + ',' + jsonObjProxy[key]["Date"] + ',' + jsonObjProxy[key]["ID"] + ',' + "OK";
                                objOutput = [recordOutput];
                                output.push(objOutput);
                            }
                        }
                    }
                }
            }
        }
        recordSummary = dateStart + ' to ' + dateEnd + '|' + numberOfRecordsProcessed + '|' + numberOfDescrepancy + '|' + typeOfDescrepancies;
        objSummary = [recordSummary];
        summary.push(objSummary);
        var csvDataSource = exportToCsv.generateCsv(summary, true);
        fs.writeFileSync(__dirname + '/csv_Files/Outputs/fileSummary.txt', csvDataSource);
        var csvDataProxy = exportToCsv.generateCsv(output, true);
        fs.writeFileSync(__dirname + '/csv_Files/Outputs/fileOutput.txt', csvDataProxy);
    });
});
console.log('done');
