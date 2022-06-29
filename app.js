require('dotenv').config();

var Web3 = require('web3');
const HDWalletProvider = require("@truffle/hdwallet-provider");
var async = require("async");
var process = require('process');

const Pool = require('pg').Pool

const pool = new Pool({
  user: 'webapp',
  database: 'cryptolottery',
  password: 'cryptolotterry101!',
  port: 5432,
  host: 'localhost',
})



var contractAddress = process.env.CONTRACT_ADDRESS;
var abi = JSON.parse('[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"punter","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"betId","type":"uint256"}],"name":"Bet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"betId","type":"uint256"}],"name":"GameOver","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"betId","type":"uint256"}],"name":"NewGame","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"betId","type":"uint256"}],"name":"Winner","type":"event"},{"inputs":[],"name":"bet","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"betId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currentStatus","outputs":[{"components":[{"components":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bool","name":"isWinner","type":"bool"}],"internalType":"struct LotteryV6.PunterBet[]","name":"punterBets","type":"tuple[]"},{"internalType":"uint256","name":"totalPrizeMoney","type":"uint256"},{"internalType":"bool","name":"isDrawn","type":"bool"}],"internalType":"struct LotteryV6.Status","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"draw","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getGameId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTotalPunters","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newBetId","type":"uint256"}],"name":"newGame","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"openForBets","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"prizeMoney","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxiableUUID","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"reset","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"}]');

const ethNetwork = process.env.JSON_RPC_ETHEREUM_ADDRESS;
var mnemonic = process.env.MNEMONIC;

const provider = new HDWalletProvider(mnemonic, ethNetwork);
const web3 = new Web3(provider);

// For retrieving events
var webSocket3 = new Web3(new Web3.providers.WebsocketProvider(process.env.WEBSOCKET_ADDRESS));
var webSocketContract = new webSocket3.eth.Contract(abi, contractAddress);

let count = 0;

async function getTimeByBlock(txHash) {
  const blockN = await web3.eth.getTransaction(txHash)
  const blockData = await web3.eth.getBlock(blockN.blockNumber)
  return blockData.timestamp
}


webSocketContract.events.NewGame({
  // filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
   fromBlock: 0,
 }, function(error, event){ })
 .on('data', function(event){
   console.log(event);
 });

 webSocketContract.events.GameOver({
  // filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
   fromBlock: 0,
 }, function(error, event){ })
 .on('data', function(event){
   console.log(event);
 });

webSocketContract.events.Bet({
  // filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
   fromBlock: 0,
 }, function(error, event){ })
 .on('data', function(event){
  //  console.log(JSON.stringify(event, 0, 3));
    async.waterfall([
      function dummy(callback) {
        let context = {};
        context['transactionHash'] = event["transactionHash"];
        context['eventType'] = event['event'];
        context['punterAddress'] = event["returnValues"]["punter"];
        context['numPunters'] = event["returnValues"]["numPunters"];
        context['betAmount'] = event["returnValues"]["value"];
        context['betId'] = event["returnValues"]["betId"];
        context["blockHash"] = event["blockHash"];
        callback(null, context);
      },
      // function getTransaction(data, callback) {
      //   return web3.eth.getTransaction(data['transactionHash'], function(err, data) {
      //     console.log("Got Transaction " + JSON.stringify(data, 0, 3));
      //     callback(null, data);
      //   });
      // },
      function getBlockAndTime(context, callback) {
        return web3.eth.getBlock(context["blockHash"], function(err, data) {
//            console.log("Got Block now " + JSON.stringify(data, 0 , 3));
            context['timestamp'] = data.timestamp;
            callback(null, context);
        });
      }], function(err, result) {
      //console.log("Result: " + JSON.stringify(result,0,3));
      console.log("@ " + new Date(result['timestamp'] * 1000) + " Bet from " + result['punterAddress'] + " amount :" + web3.utils.fromWei(result['betAmount'], 'ether') + " Bet Id: " + result['betId']);

      let ev = {};
      ev['game_id'] = result['betId'];
      ev['ev_type'] = 'BET_EV';
      ev['tx_hash'] = result['transactionHash'];
      ev['punter_address'] = result['punterAddress'];
      ev['bet_value'] = result['betAmount'];
      ev['occurred_at'] = result['timestamp'];

      insert(ev);
    });

    

   count++;
  //  console.log("Total events: " + count);
 }).on('changed', function(event){
   // remove event from local database
   //console.log("Change Event " + event);
 })
 .on('error', function(event) {
   console.log("Error event: " + event);
});

async function insert(ev) {
  const res =  pool.query("INSERT INTO events (game_id, ev_type, punter_address, tx_hash, bet_value, occurred_at) VALUES ($1, $2, $3, $4, $5, $6) ", [ev['game_id'], ev['ev_type'], ev['punter_address'], ev['tx_hash'], ev['bet_value'], ev['timestamp']], (error, results) => {
    if (error) {
      console.log("Error : " + error);
      throw error
    }
  });
  console.log("Added an event of type " + ev['ev_type']);
}