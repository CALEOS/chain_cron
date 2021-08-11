const eosjs = require('eosjs')
const fetch = require('node-fetch')
const util = require('util')
const config = require('./config')
const JsSignatureProvider = require('eosjs/dist/eosjs-jssig').JsSignatureProvider
const axios = require('axios')
const JsonRpc = eosjs.JsonRpc
const Api = eosjs.Api

const nodeUrl = config.nodeUrl
const keys = config.keys

const mainnetSignatureProvider = new JsSignatureProvider(config.mainnet.keys);
const testnetSignatureProvider = new JsSignatureProvider(config.testnet.keys);
const mainnetRpc = new JsonRpc(config.mainnet.nodeUrl, { fetch })
const testnetRpc = new JsonRpc(config.testnet.nodeUrl, { fetch })

const mainnet = new Api({
    mainnetRpc,
    mainnetSignatureProvider,
    textDecoder: new util.TextDecoder(),
    textEncoder: new util.TextEncoder()
});

const testnet = new Api({
    testnetRpc,
    testnetSignatureProvider,
    textDecoder: new util.TextDecoder(),
    textEncoder: new util.TextEncoder()
});


const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function random(min, max) {
  return Math.floor(
    Math.random() * (max - min) + min
  )
}


(async (mainnet, testnet) => {
  console.log("MAINNET=======");
  api = mainnet;
  await doMechanics();

  console.log("TESTNET=======");
  api = testnet;
  await doMechanics();
})(mainnet, testnet)


async function doMechanics() {
    //await sleep(random(1000, 30000));
    console.log("sending CPU eosmechanics");
    await sendActions([{
        account: 'eosmechanics',
        name: 'cpu',
        authorization: [{
            actor: 'eosmechanics',
            permission: 'active',
        }],
        data: {}
    }])
    console.log("sent CPU eosmechanics");
}

async function sendActions(actions) {
    try {
        const result = await api.transact({ actions: actions }, { blocksBehind: 3, expireSeconds: 30 });
    } catch (e) {
        console.log(e);
    }
}
