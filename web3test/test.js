var Web3 = require("web3");
//创建web3对象
var web3 = new Web3();
// 连接到以太坊节点
web3.setProvider(new Web3.providers.HttpProvider('http://10.0.2.15:8545'));

console.log(web3.currentProvider);
if(!web3.isConnected) {
console.log("WEB3 is not connected!");
}
else {
console.log("WEB3 is connected!");
}

//web3.eth.defaultAccount = web3.eth.accounts[1];
var abi = [
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "gambler",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "timeStamp",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "description",
          "type": "string"
        }
      ],
      "name": "gamblerEvent",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "addr",
          "type": "address"
        }
      ],
      "name": "setContractAccount",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "showContractBalance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "wager",
          "type": "uint16"
        }
      ],
      "name": "setMaxAllowedWagerPerGame",
      "outputs": [
        {
          "name": "",
          "type": "uint16"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "maxWagerForContract",
          "type": "uint16"
        }
      ],
      "name": "setMaxAllowedWagerForContract",
      "outputs": [
        {
          "name": "",
          "type": "uint16"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "maxBetNum",
          "type": "uint16"
        }
      ],
      "name": "setMaxBetNumbers",
      "outputs": [
        {
          "name": "",
          "type": "uint16"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "maxDuration",
          "type": "uint16"
        }
      ],
      "name": "setMaxAllowedTimePerGame",
      "outputs": [
        {
          "name": "",
          "type": "uint16"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "minAcceptFee",
          "type": "uint16"
        }
      ],
      "name": "setMinAcceptableFee",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "enContract",
          "type": "bool"
        }
      ],
      "name": "adminOperContract",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "showLotteryCtrl",
      "outputs": [
        {
          "name": "contractCtrl",
          "type": "bool"
        },
        {
          "name": "maxAllowedWagerPerGame",
          "type": "uint32"
        },
        {
          "name": "maxAllowedWagerForContract",
          "type": "uint32"
        },
        {
          "name": "maxBetNumbers",
          "type": "uint16"
        },
        {
          "name": "maxAllowedTimePerGame",
          "type": "uint32"
        },
        {
          "name": "minAcceptFee",
          "type": "uint16"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "showCreator",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "allowedWager",
          "type": "uint256"
        }
      ],
      "name": "createGame",
      "outputs": [
        {
          "name": "createResult",
          "type": "bool"
        }
      ],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferToContract",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "gameCreator",
          "type": "address"
        }
      ],
      "name": "joinGame",
      "outputs": [
        {
          "name": "joinResult",
          "type": "bool"
        }
      ],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "addGamer",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "startGame",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "gameCreator",
          "type": "address"
        }
      ],
      "name": "bet",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "deleteGame",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "stopGame",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "to",
          "type": "address"
        },
        {
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "withDraw",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    }
  ];

var infoContract = web3.eth.contract(abi);
var info = infoContract.at('0x9a92b1c9d249e9d11410f777f0e0d3a364f73876');
var gamblerEv = info.gamblerEvent();
/*
gamblerEv.watch(function(error, result) {
    if (!error) {
          console.log(result.args.gambler, result.args.timeStamp, result.args.value,result.args.description); 
    } else {
          console.log(error);
    }
});*/

info.events.gamblerEvent(
  {fromBlock:0,
   toBlock:'latest'},
   function(err,event){
    console.log("result:\n"+JSON.stringify(event)); 
   })
   .on('data',function(event){console.log(event)})
   .on('changed',function(event){})
   .on('error',console.error);

async function createGame(amount,gameCreator1)
{
   var result = await info.method.createGame(amount).send({from:gameCreator,value:amount});
   console.log("Game creating result " + result + " by "+gameCreator1);
}

async function bet(gamer,gameCreator)
{
  var result = await info.method.bet(gameCreator).send({from:gamer});
  console.log(gamer+" bet result " + result);
}

async function addGamer(gameCreator)
{
  var result = await info.method.joinGame().send({from:gameCreator});
  console.log(gameCreator + " add contract as the counter part " + result +"!");
}

async function joinGame(gameCreator,gamer)
{
  var result = await info.method.joinGame(gameCreator).send({from:gamer});
  console.log(gamer + " join " + gameCreator + " result " + result);
}

async function deposit(gamer,contractAddr,amount)
{
  var result = await web3.eth.sendTransaction({from:gamer,to:contractAddr,value:amount});
  console.log(gamer + " deposit " + amount + " to " + contractAddr + " " + result + ".");
}

async function withdraw(gamer,amount)
{
  var result = await info.method.withDraw(amount).send({from:contractAddr,to: gamer,value:amount});
  console.log(gamer + " withdraw " + amount + " result "+ result + " welcome to the game next time.");
}

async function startGame(gameCreator)
{
  var result = await info.method.startGame().send({from:gameCreator});
  console.log("game " + gameCreator + " is started. result "+ result);
}

async function stopGame(gameCreator)
{
  var result = await info.method.stopGame().send({from:gameCreator});
  console.log("game "+gameCreator+" is stopped. result "+ result);
}

async function deleteGame(gameCreator)
{
  var result = await info.method.deleteGame().send({from:gameCreator});
  console.log("game "+gameCreator+" is deleted. result "+result);
}

async function getJoiner(gameCreator)
{
  var result = await info.method.getGamers(gameCreator);
}
























//web3.eth.getAccounts()
//.then(console.log)
//function getCoinbaseBalance(value)
//{
//    console.log("Coinbase is "+value);
//    var balance = web3.eth.getBalance(value)
//    .then(function(data){
//    console.log("Coinbase account has balance "+data);
//    var value1 = web3.utils.fromWei(data,"ether"); 
//    console.log("Coinbase has ether totally:"+value1);
//    },console.log);
//}
//web3.eth.getCoinbase()
//.then(getCoinbaseBalance)
//.catch(console.log);
//console.log(web3.eth.accounts[0]);
//var version = web3.version.node;
//console.log(version);



