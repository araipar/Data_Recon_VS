import { Console } from 'console';
import { ExportToCsv } from 'export-to-csv';
import * as fs from 'fs';
import * as csvParse from 'csv-parse';
import console = require('console');
const csv = require('csvtojson') // Make sure you have this line in order to call functions from this modules

var dateRange: string = "1-31 Jul 2021"; // hardcode bcs we are processing July 2021 Only
var numberOfRecordsProcessed: number = 0;
var numberOfDescrepancy: number = 0;
var typeOfDescrepancies: string = "";
var recordOutput: string = "";
var recordSummary: string = "";
const output = [['Amt,Descr,Date,ID,Remark']];
const summary = [['Date Range,Number Of Records Processed,Number Of Desrepancy,Type Of Desrepancy']];
var objOutput = [''];
var objSummary = [''];
const options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: false,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false
};
const exportToCsv = new ExportToCsv(options);
var parserSummary = csvParse.parse({ delimiter: ';' }, function (err) {
    const csvDataSource = exportToCsv.generateCsv(summary, true);
    fs.writeFileSync(__dirname + '/csv_Files/Outputs/fileSummary.txt', csvDataSource)
    console.log(output);
});

var parserOutput = csvParse.parse({ delimiter: ';' }, function (err) {
    const csvDataProxy = exportToCsv.generateCsv(output, true);
    fs.writeFileSync(__dirname + '/csv_Files/Outputs/fileOutput.txt', csvDataProxy)
    console.log(output);
    //console.log(data);
});



const csvProxyPath = __dirname + '/csv_Files/Inputs/proxy.csv' // Resource.csv in your case
const csvSourcePath = __dirname + '/csv_Files/Inputs/source.csv' // Resource.csv in your case

var objProxy = csv().fromFile(csvProxyPath) // parse file proxy to json
    .then((jsonObjProxy) => {

        csv().fromFile(csvSourcePath).then((jsonObjSource) => { // parse file source to json
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
                        recordOutput = jsonObjProxy[key]["Amt"] + ',' + jsonObjProxy[key]["Descr"] + ',' + jsonObjProxy[key]["Date"] + ',' + jsonObjProxy[key]["ID"] + ',' +"Record does not exist in Source"
                      
                        objOutput = [recordOutput];
                        output.push(objOutput);
                        numberOfDescrepancy += 1;
                        typeOfDescrepancies += '&' + 'nonExist';
                       
                    } else { // ID exist in source
                        recordOutput = jsonObjProxy[key]["Amt"] + ',' + jsonObjProxy[key]["Descr"] + ',' + jsonObjProxy[key]["Date"] + ',' + jsonObjProxy[key]["ID"] + ',' + "Record exist in Source"
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




        })

    })








/*fs.createReadStream(__dirname + '/csv_Files/Inputs/source.csv').pipe(parserSource);*/



console.log('done');