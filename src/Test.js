var showMsgOnWeb = function (msg,type) {
    var color = ['blue','red','black'];
    var div=document.createElement("div");
    div.innerText = msg;
    div.style.color = color[type];
    document.body.appendChild(div);
};


//gameHero,0庄家，1闲家
var Player = function (id,score,gameHero) {
    id = id||0;
    score = score || 1000;
    gameHero = gameHero || 1;
    var  self = this;
    this.id = id;
    this.score = score;
    this.gameHero = gameHero;
    this.toString=function () {
        return 'id:'+self.id+',分数:'+self.score;
    };
};



//桌子
var Table = function (tableId,total) {

    total = total||4;
    this.players = [];
    this.id = tableId||0;
    this.status = 0; //0没开始，1.游戏中 2.游戏结束
    var self = this;

    this.addPlayer = function (player) {
        if(self.players.length<total)
        {
            for(idx in self.players)
            {
                if(self.players[idx].id==player.id)
                    return console.log('不能重复添加进入本桌');
            }
            self.players.push(player);
        }

        else
            return console.log('本桌人数已满');
    };

    this.setHero = function () {
        var idx = Math.floor(Math.random()*total);
        showMsgOnWeb('庄家座位号:'+idx,1);
        for(var i=0;i<total;i++){
            if(idx==i) self.players[i].gameHero = 0;
            else self.players[i].gameHero = 1;
        }
    };

    this.clear = function () {
      self.players=[];
      self.status = 0;
    };

    this.setBase=function (base) {
        self.base = base;
    };

    this.startGame = function () {
        if(!!self.status) {
            return console.log('游戏还没开始呢');
        };
        if(4!=self.players.length){
            return console.log('游戏人数不足');
        }
        self.status = 1;
        window.setTimeout(self.endGame,1000*(self.minS/60)+1000*Math.ceil(Math.random()*((self.maxS-self.minS)/60)));
    };

    this.setTime =function (minS,maxS) {
        self.minS = minS||120;
        self.maxS = maxS||180;
        showMsgOnWeb('设置时间'+self.minS+'-'+self.maxS,1);
    };

    this.endGame = function () {
        self.status = 2;
        var idx = Math.floor(Math.random()*4);
        self.updateScore(idx);
        console.log('idx : ',idx);
        var e = new Event('gameEnd');
        e.tableId = self.id;
        document.dispatchEvent(e);
    };

    this.setChance=function (chance) {
        self.cPass= chance.cPass||16;
        self.cBase = chance.cBase||16;
        self.cOne = chance.cOne||16;
        self.cTwo = chance.cTwo||16;
        self.cThree = chance.cThree||16;
        self.cFour = chance.cFour||20;
    };

    this.getResultByChance = function () {
            var i = Math.floor(Math.random()*100);
            var v1 = this.cPass;
            var v2 = v1+this.cBase;
            var v3 = v2+this.cOne;
            var v4 = v3+this.cTwo;
            var v5 = v4+this.cThree;
            if(i<v1) return 0;
            if(i<v2) return 1;
            if(i<v3) return 2;
            if(i<v4) return 3;
            if(i<v5) return 4;
            return 5;
    };
    this.updateScore=function(idx){
        showMsgOnWeb('桌号'+self.id+'比赛结果:\n',0);
        var base = self.base||100;
        var multiple=[8,16,32,64,128];
        var randomResult = self.getResultByChance()-1;
        if(randomResult<0)
        {
            showMsgOnWeb('流局',1);
            return;
        }
        console.log(self.players);
        var score = base*multiple[randomResult];
        var huZ = self.players[idx].gameHero==0;
        for(var i=0;i<total;i++){
            var isZ = self.players[i].gameHero==0?true:false;
            var preMsg='(座位号'+i+')'+self.players[i].toString();
            if(i==idx)
            {
                var won = isZ?score*3:(score*2/8+score);
                self.players[i].score += won;
                showMsgOnWeb((isZ?'庄家:':'闲家:')+preMsg+'+'+won,0);
            }
            else{
                var lost = isZ?score:(huZ?score:score/8);
                self.players[i].score -= lost;
                showMsgOnWeb((isZ?'庄家:':'闲家:')+preMsg+'-'+lost,0);
            }

        }
    };
};

//游戏管理类
var GameMgr = function (playerNum,minScore) {
    var self = this;
    var date = null;
    this.players=[];
    this.outPlayers=[];
    this.tables=[];
    this.minScore = minScore||500;
    this.playersNum=playerNum||16;
//玩家的设置
    this.addPlayer = function (player) {
        if(player.score<self.minScore)
        {
            self.outPlayers.push(player);
            showMsgOnWeb('玩家'+player.id+'积分'+player.score+'已被淘汰...',1);
            return console.log('玩家'+player.id+'积分'+player.score+'已被淘汰...');
        }
        self.players.push(player);
    };

    this.moverPlayer = function () {
        self.players.shift();
    };

    this.getPlayer = function () {
        return self.players[0];
    };

//桌子的设置
    this.addTable = function (table) {
        self.tables.push(table);
    };
    this.getTable=function (tableId) {
        for (idx in self.tables){
            if(tableId==self.tables[idx].id)
                return self.tables[idx];
        }
    };

    this.clearTable = function (tableId) {
        var table = self.getTable(tableId);
        for(var i=0;i<table.players.length;i++)
        {
            if(!!table.players[i])
                self.addPlayer(table.players[i]);
        }
        self.getTable(tableId).clear();
    };

    this.clearAllTable = function () {
        for(idx in self.tables){
            self.tables[idx].clear();
        }
    };

    this.startGame = function () {
        date = new Date();
        showMsgOnWeb('游戏开始时间:'+date);
        for(idx in self.tables)
        {
            self.tables[idx].setHero();
            self.tables[idx].startGame();
        }
    };

    document.addEventListener('gameEnd',function (e) {
       console.log(e);
       self.endGame(e.tableId);
    });
    
    this.endGame = function (tableId) {
            showMsgOnWeb('桌子'+tableId+'游戏已经结束........正在清理桌面');
            self.clearTable(tableId);
            self.checkPlayers();
    };
    this.checkPlayers = function () {
        self.showPlayers();
        if(self.players.length>=4){
            var table = self.getFreeTable();
            if(!!table)
            {
                table.addPlayer(self.players[0]);
                self.players.shift();
                table.addPlayer(self.players[0]);
                self.players.shift();
                table.addPlayer(self.players[0]);
                self.players.shift();
                table.addPlayer(self.players[0]);
                self.players.shift();
                table.setHero();
                table.startGame();
            }
        }
        else
        {
            self.dealResult();
        }
    };

    this.showPlayers=function () {
        showMsgOnWeb('通道还有'+self.players.length+'玩家等待:',0);
        for(idx in self.players)
            showMsgOnWeb(self.players[idx].toString(),0);
    };

    this.dealResult=function () {
      if(self.isEnd())
      {
            console.log('比赛已经结束');
            console.log({最终剩余玩家:self.players,淘汰玩家:self.outPlayers});
            self.showResult();
      }
    };

    this.showResult = function () {
        showMsgOnWeb('比赛已经结束',1);
        self.players.sort(function (p1,p2) {
           return p1.score<p2.score;
        });
        var dateend = new Date();
        showMsgOnWeb('游戏结束时间:'+dateend);
        var sec = (dateend-date)/1000;
        showMsgOnWeb('本次比赛耗时'+sec+'秒,折合实际时间约'+sec+'分钟',1);
        for(var i=0;i<self.players.length;i++){
            showMsgOnWeb('第'+(i+1)+'名:'+self.players[i].toString(),0);
        }

        for(var j=self.outPlayers.length,k=self.players.length+1;j>0;j--){
            showMsgOnWeb('第'+(k++)+'名:'+self.outPlayers[j-1].toString(),0);
        }
    };


    this.isEnd=function () {
        return self.outPlayers.length>self.playersNum-4;
    };
    
    this.getFreeTable=function () {
            for(idx in self.tables)
            {
                if(self.tables[idx].status==0)
                    return self.tables[idx];
            }
            return null;
    };
};


var addZero = function (value,len) {
    if(len<0) return '0';
    var zero = '0';
    for(var i=0;i<len;i++){
        zero+='0';
    }
    var result = zero+value;
    return result.substr(result.length-len,result.length);
};

var main = function (playerNum,baseScore,base,minScore,chance,minS,maxS) {

    playerNum = playerNum||16;
    baseScore = baseScore||1000;
    base = base||100;
    minScore = minScore||500;
    minS = minS||120;
    maxS = maxS||180;
    console.log({playerNum:playerNum,baseScore:baseScore,base:base,minScore:minScore});
    if(playerNum%4!==0||playerNum<4) console.log('比赛人数必须为4的倍数,请检查后确定',1);
    showMsgOnWeb('开始参数:'+'参赛人数='+playerNum+',初试分数='+baseScore+',麻将基础分='+base+',淘汰分数='+minScore,0);
    if(!!chance){
        showMsgOnWeb('流局概率:'+(chance.cPass=chance.cPass||16)+'%,'+
            '8:1概率:'+(chance.cBase=chance.cBase||16)+'%,'+
            '16:2概率:'+(chance.cOne=chance.cOne||16)+'%,'+
            '32:4概率:'+(chance.cTwo=chance.cTwo||16)+'%,'+
            '64:8概率:'+(chance.cThree=chance.cThree||16)+'%,'+
            '128:16概率:'+(chance.cFour=chance.cFour||20)+'%',0);
    }
    var game = new GameMgr(playerNum,minScore);
    for(var i=0;i<playerNum/4;i++){
        var table = new Table(i,4);
        table.setBase(base);
        table.setChance(chance);
        table.setTime(minS,maxS);
        table.addPlayer(new Player(addZero(i*4+1,4),baseScore));
        table.addPlayer(new Player(addZero(i*4+2,4),baseScore));
        table.addPlayer(new Player(addZero(i*4+3,4),baseScore));
        table.addPlayer(new Player(addZero(i*4+4,4),baseScore));
        game.addTable(table);
    }
        game.startGame();
};
