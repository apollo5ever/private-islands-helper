const fetch = require('node-fetch-commonjs');

async function addSupporter(address,tier,amount,auth){

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
        headers:{'Authorization':auth,'Content-Type':'application/json'}
    })
}

module.exports = addSupporter