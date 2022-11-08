require('dotenv').config()
const fetch = require('node-fetch-commonjs');
const fs = require('fs');

var lastHeight =parseInt(process.env.LAST_HEIGHT)


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
                addSupporter(address,tier,amount)
                
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
        fs.writeFile('.env',`LAST_HEIGHT=${lastHeight}`,(err) => {
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

async function addSupporter(address,tier,amount){

    var addSupporterData = JSON.stringify(
        {
            "jsonrpc": "2.0",
            "id": "1",
            "method": "scinvoke",
            "params": {
                "scid": "ce99faba61d984bd4163b31dd4da02c5bff32445aaaa6fc70f14fe0d257a15c3",
                "ringsize": 2,
                "sc_dero_deposit":amount,
                "sc_rpc": [{
                    "name": "entrypoint",
                    "datatype": "S",
                    "value": "AS"
                },
                {
                    "name": "T",
                    "datatype": "S",
                    "value": tier
                },
                {
                    "name": "S",
                    "datatype": "S",
                    "value": address
                }]
            }
        }
    )
    fetch('http://127.0.0.1:10103/json_rpc',{
        method:'POST',
        body:addSupporterData,
        headers:{'Content-Type':'application/json'}
    })
}

setInterval(
    getTransfers,5000
)
