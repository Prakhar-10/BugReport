const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const json2xls = require("json2xls");

let bugger = [];




function getBugs(bugLink){
    request(bugLink,function(error,response,data){
        processData(data);
    })
    
}

function processData(html){
    let myDocument = cheerio.load(html);
    let bugNames = myDocument(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title");
    // let commentNames = myDocument("a>.text-small.text-bold");
    let count =0;
    for(let i=0;i<bugNames.length;i++){
        let bugName = myDocument(bugNames[i]);
        let name = bugName.text();
        // let commentNames = bugName.text();
        // console.log(name);
        count++;
        bugReport(count,name);
        
    }
    
}

function bugReport(count,name){
    let filePath = `./Bug`;
    
    let bugObj = {ID:count,BugName:name};

    bugger.push(bugObj);
    
    fs.writeFileSync(filePath,JSON.stringify(bugger));
    
    toExcel(filePath);


}

function  toExcel(path){
    let data = JSON.parse(fs.readFileSync(`${path}`));
    let xls = json2xls(data);
   
    let filePath = `${path}.xlsx`;  
    fs.writeFileSync(filePath,xls,'binary');
}

module.exports = getBugs;
