import { ExportToCsv } from 'export-to-csv';
import * as fs from 'fs';
import console = require('console');
const csv = require('csvtojson') // Make sure you have this line in order to call functions from this modules

var dateStart: string = "";
var dateEnd: string = ""; 
var numberOfRecordsProcessed: number = 0;
var numberOfDescrepancy: number = 0;
var typeOfDescrepancies: string = "";
var recordOutput: string = "";
var recordSummary: string = "";
const output = [['Amt,Descr,Date,ID,Remark']];
const summary = [['Date Range|Number Of Records Processed|Number Of Desrepancy|Type Of Desrepancy']];
var objOutput = [''];
var objSummary = [''];

const options = {  //csv props
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




const csvProxyPath = __dirname + '/csv_Files/Inputs/proxy.csv' //  records in our case
const csvSourcePath = __dirname + '/csv_Files/Inputs/source.csv' // bank statment in your case

var objProxy = csv().fromFile(csvProxyPath) // parse file proxy to json
    .then((jsonObjProxy) => {

        csv().fromFile(csvSourcePath).then((jsonObjSource) => { // parse file source to json 

            dateStart = jsonObjProxy[0]["Date"];  //initial date
            dateEnd = jsonObjProxy[0]["Date"];
            // analyze here :   
            for (var key in jsonObjProxy) {
                if (jsonObjProxy.hasOwnProperty(key)) {
                    var recordId = jsonObjSource.filter(function (item) {   // getting each record in source where id = in each proxy
                        return item.ID == jsonObjProxy[key]["ID"];

                    });


                    if (Date.parse(dateStart) > Date.parse(jsonObjProxy[key]["Date"])) {  // getting max & min date for summary report
                        dateStart = jsonObjProxy[key]["Date"];
                    }
                    if (Date.parse(dateEnd) < Date.parse(jsonObjProxy[key]["Date"])) {
                        dateEnd = jsonObjProxy[key]["Date"];
                    }

                    numberOfRecordsProcessed += 1; // numberOfDescrepancy for summary report


                    // analysis flow : check ID -> check Amount -> check Date -> check Description 

                    if (Object.keys(recordId).length != 1) { //ID not exist in source or might be containing duplicate in source
                        recordOutput = jsonObjProxy[key]["Amt"] + ',' + jsonObjProxy[key]["Descr"] + ',' + jsonObjProxy[key]["Date"] + ',' + jsonObjProxy[key]["ID"] + ',' + "Record does not exist or duplicated in Source"

                        objOutput = [recordOutput];
                        output.push(objOutput);
                        numberOfDescrepancy += 1;
                        typeOfDescrepancies += 'nonExistOrDuplicate;';

                    } else { // ID exist in source
                        var recordAmount = jsonObjSource.filter(function (item) {
                            return item.Amount == jsonObjProxy[key]["Amt"];

                        });

                        if (Object.keys(recordAmount).length == 0) {//cek Amountt
                            recordOutput = jsonObjProxy[key]["Amt"] + ',' + jsonObjProxy[key]["Descr"] + ',' + jsonObjProxy[key]["Date"] + ',' + jsonObjProxy[key]["ID"] + ',' + "Amount Mismatch"

                            objOutput = [recordOutput];
                            output.push(objOutput);
                            numberOfDescrepancy += 1;
                            typeOfDescrepancies += 'AmountMismatch;';

                        } else {
                            var recordDate = jsonObjSource.filter(function (item) {  // check Date
                                return item.Date == jsonObjProxy[key]["Date"];

                            });

                            if (Object.keys(recordDate).length == 0) {//cekDate
                                recordOutput = jsonObjProxy[key]["Amt"] + ',' + jsonObjProxy[key]["Descr"] + ',' + jsonObjProxy[key]["Date"] + ',' + jsonObjProxy[key]["ID"] + ',' + "Date Mismatch"

                                objOutput = [recordOutput];
                                output.push(objOutput);
                                numberOfDescrepancy += 1;
                                typeOfDescrepancies += 'DateMismatch;';

                            } else {
                                var recordDesc = jsonObjSource.filter(function (item) { //check Desc
                                    return item.Description == jsonObjProxy[key]["Descr"];

                                });

                                if (Object.keys(recordDesc).length == 0) {//cekDesc
                                    recordOutput = jsonObjProxy[key]["Amt"] + ',' + jsonObjProxy[key]["Descr"] + ',' + jsonObjProxy[key]["Date"] + ',' + jsonObjProxy[key]["ID"] + ',' + "Description Mismatch"

                                    objOutput = [recordOutput];
                                    output.push(objOutput);
                                    numberOfDescrepancy += 1;
                                    typeOfDescrepancies += 'DescriptionMismatch;';

                                } else {
                                    recordOutput = jsonObjProxy[key]["Amt"] + ',' + jsonObjProxy[key]["Descr"] + ',' + jsonObjProxy[key]["Date"] + ',' + jsonObjProxy[key]["ID"] + ',' + "OK"

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



            const csvDataSource = exportToCsv.generateCsv(summary, true);
            fs.writeFileSync(__dirname + '/csv_Files/Outputs/fileSummary.txt', csvDataSource)


            const csvDataProxy = exportToCsv.generateCsv(output, true);
            fs.writeFileSync(__dirname + '/csv_Files/Outputs/fileOutput.txt', csvDataProxy)




        })

    })



console.log('done');