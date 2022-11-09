require('dotenv').config()
const fetch = require('node-fetch-commonjs');
const fs = require('fs');
const addSupporter = require('./contract calls/addSupporter')
const topUp = require('./contract calls/topUp')


var last_height = fs.readFileSync('./last_height.json');
var lastHeight = JSON.parse(last_height).lastHeight;


let auth = "Basic " + Buffer.from(`${process.env.LOGIN}:${process.env.PASS}`).toString('base64')

var data = JSON.stringify({
    "jsonrpc": "2.0",
    "id": "1",
    "method": "GetTransfers",
    "params": {
    	"in":true,
        "out":false,
        "coinbase":false,
        "min_height":lastHeight,
        "dstport":1
    }
})

var heightData = JSON.stringify(
    {
        "jsonrpc": "2.0",
        "id": "1",
        "method": "DERO.GetHeight"
    }
)



async function getTransfers(){
    
    fetch('http://127.0.0.1:10103/json_rpc', {
        method: 'POST',
        body: data,
        headers:  {'Authorization':auth, 'Content-Type':'application/json'}
        
    }).then(res=>res.json())
    .then((json) => {
      if(json.result.entries){  
        console.log(result.entries)
        for(var i=0;i<json.result.entries.length;i++){
            if(json.result.entries[i].dstport==1){
                var address=""
                var tier=""
                var amount = json.result.entries[i].amount
                for(var j=0;j<json.result.entries[i].payload_rpc.length;j++){
                    
                    if(json.result.entries[i].payload_rpc[j].name=="address"){
                       address=json.result.entries[i].payload_rpc[j].value
                    }
                    if(json.result.entries[i].payload_rpc[j].name=="tier"){
                        tier = json.result.entries[i].payload_rpc[j].value
                    }
                }
                addSupporter(address,tier,amount,auth)
                
            }else if(json.result.entries[i].dstport==2){
                //topup
                var address=""
                var tier=""
                var amount = json.result.entries[i].amount
                for(var j=0;j<json.result.entries[i].payload_rpc.length;j++){
                    
                    if(json.result.entries[i].payload_rpc[j].name=="address"){
                       address=json.result.entries[i].payload_rpc[j].value
                    }
                    if(json.result.entries[i].payload_rpc[j].name=="tier"){
                        tier = json.result.entries[i].payload_rpc[j].value
                    }
                }
                topUp(address,tier,amount,auth)
            }else if(json.result.entries[i].dstport==3){
                //fundraiser
            }else if(json.result.entries[i].dstport==4){
                //bounty
            }
        }
    }
    }).then(()=>{
        getHeight()
    })
    
}

async function getHeight(){
    console.log("get height")
    fetch('http://147.182.177.142:9999/json_rpc',{
        method: 'POST',
        body:heightData,
        headers: {'Content-Type':'application/json'}
    }).then(res=>res.json())
    .then((json)=>{
        lastHeight = json.result.height
        fs.writeFile('last_height.json',`{"lastHeight":${lastHeight}}`,(err) => {
              if (err)
                console.log(err);
              else {
                console.log("File written successfully\n");
              }
            })
        data = JSON.stringify({
            "jsonrpc": "2.0",
            "id": "1",
            "method": "GetTransfers",
            "params": {
                "in":true,
                "out":false,
                "coinbase":false,
                "min_height":lastHeight,
                "dstport":1
            }
        })
    })
}



setInterval(
    getTransfers,600000
)
