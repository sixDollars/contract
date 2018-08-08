pragma solidity ^0.4.21;

import "./lotteryRand.sol";

contract lottery is RandomLottery {

event gamblerEvent(address gambler, uint timeStamp, uint value, string description);

struct lotteryCtrl {
bool  fatalErr; // Fatal error coccurs, then stopping transfer balance from contract account
uint32 maxAllowedWagerPerGame;  // Max allowed wager per game            每次游戏允许的最大赌金
uint32 maxAllowedWagerForContract;// Max allowed wager for the contract, 合约参战允许的最大赌金
uint32 maxAllowedTimePerGame; //Maximum allowed time a game can last   每个游戏可持续的最长时间
uint16 maxBetNumbers; //Maximum bet number for a single person per day 每个参与者每天允许的最大游戏次数
uint16 minAcceptFee; //Minimum acceptable Fee for ont game, in Wei
mapping( address => uint16)  betNumbers; //gamber(address) current bet times in a day, if betNumbers > maxBetNumbers, it cannot join any game at the rest of the day
}

enum gameState {
INITIATED ,
RUN       ,
END       
}

struct gameInfo {
    gameState state;//INITIATED  RUN END
    uint8 betValue;
}

struct gameGroup {
uint gameStartTime;//游戏组开始游戏时间，超过最长游戏时间后，游戏强制结束并按上面的规则计算胜负，分配奖金
uint8  maxBetNum; //Maximum bet number at present, used to determine the winner
bool  gameStarted; 
mapping (address => gameInfo)  _gameInfo; 
uint16 allowedWagerForThisGame;  // allowed wager for this game            本次游戏需要的赌金
address[] gamers; //list of persons who join the game. The first index inceates the game creator by default. //每个游戏组可以有任意数量的参与者，参与者数量由game创建者决定
} 

mapping (address => gameGroup) gameGrpDB;//Stores all the currently on-going games; Store in memory to reduce Gas spent
mapping (address => uint     ) gamerBalance;//balance for each gamer, to create/join one game one should deposit enough digital currency firstly.
address private creator;
address private contractAccount;
lotteryCtrl m_lotteryCtrl;
bool locked;

constructor() public { 
    creator = msg.sender;
    contractAccount = address(0x26f66e0ea41a1490e70f8ea755495f50d35355f7);
    m_lotteryCtrl.fatalErr                   = false;
    m_lotteryCtrl.maxAllowedWagerPerGame     = 10000000;
    m_lotteryCtrl.maxAllowedWagerForContract = 5000000;
    m_lotteryCtrl.maxBetNumbers              = 500;
    m_lotteryCtrl.maxAllowedTimePerGame      = 30*60*60; //30 minutes
    m_lotteryCtrl.minAcceptFee               = 30000;
    locked = false;
}

modifier onlyCreator() {
    require(msg.sender == creator) ;
    _;
}

modifier onlyGameCreator(address gambler){
    require(gameGrpDB[gambler].gamers[0] != 0);
    _;
}

modifier noReentrancy() {
    require(!locked);
    locked = true;
    _;
    locked = false;
}

modifier balanceSufficient(address gamer, uint threshold) {
    require(gamerBalance[gamer] > threshold,"not enough balance");
    _;
}

modifier gameIsNotStarted(address game) {
    require(!gameGrpDB[game].gameStarted);
    _;
}

function setContractAccount(address addr) public onlyCreator returns(bool) {
    contractAccount = addr;
    emit gamblerEvent(msg.sender, now, 0, "Set contract account successfully!");
    return true;
}

function showContractBalance() public view onlyCreator returns(uint) {
    return contractAccount.balance;
}

function setMaxAllowedWagerPerGame(uint16 wager)  public onlyCreator returns(uint16){
    m_lotteryCtrl.maxAllowedWagerPerGame = wager;
    return wager;
}

function setMaxAllowedWagerForContract(uint16 maxWagerForContract) public onlyCreator returns(uint16){
    m_lotteryCtrl.maxAllowedWagerForContract = maxWagerForContract;
    return maxWagerForContract;
}

function setMaxBetNumbers(uint16 maxBetNum) public onlyCreator  returns(uint16){
    m_lotteryCtrl.maxBetNumbers  = maxBetNum;
    return maxBetNum;
}

function setMaxAllowedTimePerGame(uint16 maxDuration) public onlyCreator returns(uint16){
    m_lotteryCtrl.maxAllowedTimePerGame  = maxDuration;
    return maxDuration;
}

function setMinAcceptableFee(uint16 minAcceptFee) public onlyCreator {
    m_lotteryCtrl.minAcceptFee = minAcceptFee;
}

function adminOperContract(bool enContract) public onlyCreator returns(string){//disable contract balance transfer if any unexpect ocurred
    m_lotteryCtrl.fatalErr = enContract;
    return "game encounter an panic and admin down itself";
}

function showLotteryCtrl() public onlyCreator view returns (bool contractCtrl, uint32 maxAllowedWagerPerGame,
                                                     uint32 maxAllowedWagerForContract, uint16 maxBetNumbers,
                                                     uint32 maxAllowedTimePerGame, uint16 minAcceptFee) {
    return (m_lotteryCtrl.fatalErr,m_lotteryCtrl.maxAllowedWagerPerGame,
            m_lotteryCtrl.maxAllowedWagerForContract,m_lotteryCtrl.maxBetNumbers,
            m_lotteryCtrl.maxAllowedTimePerGame,m_lotteryCtrl.minAcceptFee);
}

function showCreator() public view returns (address) {
    return creator;
}

function isGameCreatedByAddr(address gamber) private view returns (bool isCreated) {
    isCreated = (gameGrpDB[gamber].gamers.length > 0 && gameGrpDB[gamber].gamers[0] != 0);
}

function isAddrJoinGame(address addr, address game) private view returns(bool) {
    for ( uint32 index = 0; index < gameGrpDB[game].gamers.length; index++) {
        if(addr == gameGrpDB[game].gamers[index]) {
            return true;
        }
    }

    return false;
}

function createGame(uint allowedWager)  public payable balanceSufficient(msg.sender, allowedWager) returns (bool createResult)  {

    bool isCreated = isGameCreatedByAddr(msg.sender);
    emit gamblerEvent(msg.sender, now, allowedWager, "after isGameCreateByAddr!");
    if(isCreated == true) {
       emit gamblerEvent(msg.sender, now, allowedWager, "not allowed to create two or more games if the previous created game not finished!");
       return false;
    }

    emit gamblerEvent(msg.sender, now, allowedWager, "msg.sender.balance >= allowedWager!");
    if(!transferToContract(allowedWager)) {
           emit gamblerEvent(msg.sender, now, allowedWager, "transfer wager from game creator to contract failed!");
           return false;
    }
    gameGroup storage game;
    emit gamblerEvent(msg.sender, now, allowedWager, "define gameGroup storage game!");
    game.allowedWagerForThisGame = allowedWager;
    game.gameStartTime           = now;
    game.maxBetNum               = 0;
    game._gameInfo[msg.sender].state         = gameState.INITIATED;
    game._gameInfo[msg.sender].betValue      = 255;///indicates this gamer has not bet yet
    game.gamers.push(msg.sender);
    gameGrpDB[msg.sender]        = game;
    emit gamblerEvent(msg.sender, now, (game.gameStartTime), "Create a game with wager successfully!");
    return true;
} 

function transferToContract(uint amount) public noReentrancy balanceSufficient(msg.sender, amount) payable returns(bool) {
    emit gamblerEvent(msg.sender, now, amount, "transfer digital money to contract");
    emit gamblerEvent(contractAccount, now, amount, "transfer digital money to contract");
    emit gamblerEvent(contractAccount, now, address(this).balance, "transfer digital money to contract");
    emit gamblerEvent(contractAccount, now, msg.sender.balance, "transfer digital money to contract");

    gamerBalance[msg.sender]     -=amount;
    gamerBalance[contractAccount]+=amount;
    return true;
}

function  joinGame(address gameCreator) public payable gameIsNotStarted(gameCreator) returns (bool joinResult) { //Join a game which is created by gameCreator
    bool isGameExist = isGameCreatedByAddr(gameCreator);
    if(!isGameExist) {
        emit gamblerEvent(msg.sender, now, 0, "try to join a non-existing game!");
        return false;//join fail
    }

    bool isJoinGame = isAddrJoinGame(msg.sender, gameCreator);
    if(isJoinGame) {
          emit gamblerEvent(msg.sender, now, gameGrpDB[gameCreator].allowedWagerForThisGame,"already join the game before, no need join again!");
          return true;
    }

    //用户余额足够可以加入游戏，加入的时候，应该扣除该用户要求的赌金，否则游戏未结束前，用户可以转走自己账户上的钱，游戏结束后将无法奖励获胜者
    if(gamerBalance[msg.sender] >= gameGrpDB[gameCreator].allowedWagerForThisGame) { 
        gameGrpDB[gameCreator].gamers.push(msg.sender);
        gameGrpDB[gameCreator]._gameInfo[msg.sender].state = gameState.INITIATED;
        gameGrpDB[gameCreator]._gameInfo[msg.sender].betValue = 255;//indicates this gamer has not bet yet
        if(transferToContract(gameGrpDB[gameCreator].allowedWagerForThisGame)) {
            emit gamblerEvent(msg.sender, now, gameGrpDB[gameCreator].allowedWagerForThisGame,"join a game successfully!");
            return true;
        } else {
            emit gamblerEvent(msg.sender, now, gameGrpDB[gameCreator].allowedWagerForThisGame,"join a game successfully!");
            return false;
        }
    }
    else {
        emit gamblerEvent(msg.sender, now, gameGrpDB[gameCreator].allowedWagerForThisGame,"do not have enough money to join the game!");
        return false;
    }
}

function addGamer()  public noReentrancy gameIsNotStarted(msg.sender) returns(bool)  {//游戏创建者仅能增加一个合约用户作为参赛者，不能增加其他外部账户为游戏者，因为其他账户的用户可能并不愿意参与游戏. noReentrancy 该修饰函数限制同时只允许有一个合约账户参赛。
    bool isGameExist = isGameCreatedByAddr(msg.sender);

    if(!isGameExist) {
         emit gamblerEvent(msg.sender, now, 0,"Only game creator can add contract as a partner!");
         return false;
    }

    if(gamerBalance[contractAccount] >= 100*gameGrpDB[msg.sender].allowedWagerForThisGame && gameGrpDB[msg.sender].allowedWagerForThisGame <=  200000) { //Game creator can  add contract as a partner only when contract has enough balance and the associated game wager is less than 200000
          if(isAddrJoinGame(contractAccount, msg.sender)) {
              emit gamblerEvent(msg.sender, now, gameGrpDB[msg.sender].allowedWagerForThisGame,"contract already joined in!");
              return false;
          }  else {
              emit gamblerEvent(msg.sender, now, gameGrpDB[msg.sender].allowedWagerForThisGame,"add contract to the game!");
              gameGrpDB[msg.sender].gamers.push(creator);
              gameGrpDB[msg.sender]._gameInfo[creator].state = gameState.INITIATED;
              gameGrpDB[msg.sender]._gameInfo[creator].betValue = 255;
              return true;
          }          
    }

    //need check if gamer has enough balance to join the game? YES
    emit gamblerEvent(msg.sender, now, gameGrpDB[msg.sender].allowedWagerForThisGame,"contract not meet the requirments to join a game!");
    return false;
}

function startGame() public onlyGameCreator(msg.sender) returns(string) {
     gameGrpDB[msg.sender].gameStarted = true;
     gameGrpDB[msg.sender].gameStartTime = now;
     emit gamblerEvent(msg.sender, now, gameGrpDB[msg.sender].allowedWagerForThisGame,"game is starting...");
     return "starting game ...";
}

function bet(address gameCreator) public returns(bool) {
     if(!isAddrJoinGame(msg.sender, gameCreator)) {
         emit gamblerEvent(msg.sender, now, 0,"gamer is not join the game, cannot bet...");
         return false;
     }

     if(gameGrpDB[gameCreator].gameStarted != true) {
         emit gamblerEvent(msg.sender, now, 0, "game is not started yet!");
         return false;
     }

     if( now - gameGrpDB[gameCreator].gameStartTime >= m_lotteryCtrl.maxAllowedTimePerGame ) {
         emit gamblerEvent(msg.sender, now, 0,"game is timeout, cannot bet any more!");
         determineWinner(gameCreator,true);
         return false;
     }

     uint betValue = getLotteryRand();
     emit gamblerEvent(msg.sender, now, betValue,"gamer bet a number!");
     gameGrpDB[gameCreator]._gameInfo[msg.sender].betValue = uint8(betValue);
     gameGrpDB[gameCreator].maxBetNum =  gameGrpDB[gameCreator]._gameInfo[msg.sender].betValue >  gameGrpDB[gameCreator].maxBetNum ? gameGrpDB[gameCreator]._gameInfo[msg.sender].betValue:gameGrpDB[gameCreator].maxBetNum;
           
     return determineWinner(gameCreator,false);
}

function determineWinner(address gameCreator, bool endGame) private returns(bool){
     bool  gamend      = endGame;
     uint  totalWager  = 0;
     uint  totalWinner = 0;
     if(gamend == false) {
         gamend = true;
         for(uint32 i = 0; i < gameGrpDB[gameCreator].gamers.length; i++) {
             totalWager += gameGrpDB[gameCreator].allowedWagerForThisGame;
             if(gameGrpDB[gameCreator]._gameInfo[gameGrpDB[gameCreator].gamers[i]].betValue == 255) {
                 if(endGame == false) {
                     gamend = false;
                     emit gamblerEvent(gameCreator, now, 0,"game has not completed yet!");
                 }
             }

             if(gameGrpDB[gameCreator]._gameInfo[gameGrpDB[gameCreator].gamers[i]].betValue == gameGrpDB[gameCreator].maxBetNum) {
                 totalWinner += 1;
             }
         }
     }

     if(gamend == true) {
         uint award = totalWager -  m_lotteryCtrl.minAcceptFee *  totalWager / gameGrpDB[gameCreator].allowedWagerForThisGame;
         award = award / totalWinner;
         for(uint32 j = 0; j < gameGrpDB[gameCreator].gamers.length; j++) {
             if(gameGrpDB[gameCreator]._gameInfo[gameGrpDB[gameCreator].gamers[j]].betValue == gameGrpDB[gameCreator].maxBetNum) {
             //give award to winners
             if(m_lotteryCtrl.fatalErr == false) {
                 gameGrpDB[gameCreator].gamers[j].transfer(award);
             }
             }
         }
     deleteGame();
     }
}

function deleteGame() public onlyGameCreator(msg.sender) returns(bool){
    delete gameGrpDB[msg.sender];
    return true;
}

function stopGame() public onlyGameCreator(msg.sender) returns(bool) {
    if(now -  gameGrpDB[msg.sender] .gameStartTime >= 10 minutes) {
       determineWinner(msg.sender,true);
       emit gamblerEvent(msg.sender, now, 0,"game is forced to stop for game timeout!");
       return true;
    }
    return false;
}

function withDraw(address to, uint16 amount) public onlyCreator payable {
    require(to != creator && to != address(this));
    emit gamblerEvent(msg.sender,now,amount,"trying to withdraw ether from contract");
    if(creator.balance >= amount) {
    to.transfer(amount);
    } else {
    emit gamblerEvent(msg.sender, now, amount, "withdraw ether from contract fail");
    }
}

function () payable {//fallback function
    emit gamblerEvent(msg.sender, now, 0, "fallback function is called!");
    emit gamblerEvent(msg.sender, now, uint16(msg.value), "fallback function is called!");
    address mycontract = address(this);   
    mycontract.transfer(msg.value);
    emit gamblerEvent(msg.sender, now, mycontract.balance, "fallback function is called!");
}

}


