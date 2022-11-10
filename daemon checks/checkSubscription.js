const fetch = require('node-fetch-commonjs');

async function checkSub(address,tier){

    var checkSubBody = JSON.stringify(
        {
            "jsonrpc": "2.0",
            "id": "1",
            "method": "DERO.GetSC",
            "params": {
                "scid": "ce99faba61d984bd4163b31dd4da02c5bff32445aaaa6fc70f14fe0d257a15c3",
                      "code":false,
                "variables":true
            }
        }
    )
    fetch('http://147.182.177.142:9999/json_rpc',{
        method:'POST',
        body:checkSubBody,
        headers:{'Content-Type':'application/json'}
    }).then(res=>res.json())
    .then((json)=>{
        let expiry = json.result.stringkeys[`${address}_${tier}`]
        if(expiry>new Date().getTime()*1000){
            return true
        }else{
            return false
        }
    })
}

module.exports = checkSub