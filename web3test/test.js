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

web3.eth.defaultAccount = web3.eth.accounts[0];
var abiRandom  = [];
var abiLottery=[
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
      "constant": true,
      "inputs": [
        {
          "name": "gamer",
          "type": "address"
        }
      ],
      "name": "getGamerIndex",
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
      "inputs": [
        {
          "name": "gamer",
          "type": "address"
        }
      ],
      "name": "isInGame",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
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
      "constant": true,
      "inputs": [
        {
          "name": "gameCreator",
          "type": "address"
        }
      ],
      "name": "getGamers",
      "outputs": [
        {
          "name": "",
          "type": "address[]"
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
var binLotteryRandom ="0x6080604052348015600f57600080fd5b50603580601d6000396000f3006080604052600080fd00a165627a7a7230582011a5cf758345776702ce17fb4fa41d8cae074eec877cd466314bd6ecc94fc8250029";
var binLotteryMain="0x608060405273d668bd32e3c694bab62df1e8cb5dce61771061ea600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555034801561006557600080fd5b5033600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000600560000160006101000a81548160ff02191690831515021790555062989680600560000160016101000a81548163ffffffff021916908363ffffffff160217905550624c4b40600560000160056101000a81548163ffffffff021916908363ffffffff1602179055506101f46005600001600d6101000a81548161ffff021916908361ffff1602179055506201a5e0600560000160096101000a81548163ffffffff021916908363ffffffff1602179055506175306005600001600f6101000a81548161ffff021916908361ffff1602179055506000600760006101000a81548160ff021916908315150217905550614afa806101a86000396000f30060806040526004361061011d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630474a68e1461028157806304d3a131146102dc5780630cf179c81461032957806314174f33146103845780631c089730146103a45780632389a290146103fb5780633400d0d71461044957806348e837b91461049657806361494b04146104ce57806367b019171461051b57806368bd3d441461054c57806376e033c7146105cb5780637f9354ab1461062657806383bd72ba146106ac578063901c947f146106db5780639d270f35146107065780639eb4fe0814610753578063c8011be914610782578063ccb9e733146107b1578063d555d47314610859578063d65ab5f214610891575b7f48157bf840bc305488597d766267e297749376775a350cb9103b669cf8391d63334234604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152602001806020018281038252601c8152602001807f66616c6c6261636b2066756e6374696f6e2069732063616c6c6564210000000081525060200194505050505060405180910390a1600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc349081150290604051600060405180830381858888f19350505050158015610231573d6000803e3d6000fd5b5034600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550005b34801561028d57600080fd5b506102c2600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610921565b604051808215151515815260200191505060405180910390f35b3480156102e857600080fd5b5061030b600480360381019080803561ffff169060200190929190505050610ffb565b604051808261ffff1661ffff16815260200191505060405180910390f35b34801561033557600080fd5b5061036a600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611089565b604051808215151515815260200191505060405180910390f35b6103a260048036038101908080359060200190929190505050611204565b005b3480156103b057600080fd5b506103b96114ff565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61042f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611529565b604051808215151515815260200191505060405180910390f35b34801561045557600080fd5b50610478600480360381019080803561ffff169060200190929190505050611e83565b604051808261ffff1661ffff16815260200191505060405180910390f35b6104b460048036038101908080359060200190929190505050611f09565b604051808215151515815260200191505060405180910390f35b3480156104da57600080fd5b506104fd600480360381019080803561ffff169060200190929190505050612773565b604051808261ffff1661ffff16815260200191505060405180910390f35b34801561052757600080fd5b5061054a600480360381019080803561ffff169060200190929190505050612801565b005b34801561055857600080fd5b5061058d600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050612880565b6040518082600560200280838360005b838110156105b857808201518184015260208101905061059d565b5050505090500191505060405180910390f35b3480156105d757600080fd5b5061060c600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050612942565b604051808215151515815260200191505060405180910390f35b34801561063257600080fd5b5061063b612b74565b60405180871515151581526020018663ffffffff1663ffffffff1681526020018563ffffffff16";

/*
var randContract = web3.eth.contract(abiRandom);
var _name="randomContract";
var name1= randContract.new(
   _name,
   {
     from: web3.eth.accounts[0],
     data: binLotteryRandom,
     gas: '470000000',
     gasPrice: '100000'
   }, function (e, contract){
    console.log(e, contract);
	   {
         console.log('Contract mined! address: ' + ' transactionHash: ');// + contract.transactionHash);
         console.log(contract);
    }
 })
*/

var mainContract = web3.eth.contract(abiLottery);
/*
_name="mainContract";
var name2= mainContract.new(
   _name,
   {
     from: web3.eth.accounts[0],
     data: binLotteryMain,
     gas: '470000000000',
     gasPrice: '100000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
	   {
         console.log('Contract mined! address: ' + ' transactionHash: ');// + contract.transactionHash);
         console.log(contract);
    }
 })
*/
var info = mainContract.at('0xaf460ab3581994b50385168bc49a6b8570ca27f9');
var gamblerEv = info.gamblerEvent();
gamblerEv.watch(function(error, result) {
    if (!error) {
          console.log(result.args.gambler, result.args.timeStamp, result.args.value,result.args.description); 
    } else {
          console.log(error);
    }
});
/*
info.events.gamblerEvent(
  {fromBlock:0,
   toBlock:'latest'},
   function(err,event){
    console.log("result:\n"+JSON.stringify(event)); 
   })
   .on('data',function(event){console.log(event)})
   .on('changed',function(event){})
   .on('error',console.error);
*/
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



