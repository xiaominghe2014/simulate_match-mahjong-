

var tdRound=0,tdGameInfo=0,tdChannelInfo=0,tdChannelPlayer=0,tdOutPlayer=0,tdOrder=0,
    tdHigameInfo=0,tdHigameOut=0,tdHigameChannel=0,tdHigameOrder=0,
    currentRound=1;

var game=NaN;

var xmUtils = {

    addZero : function (value,len) {
        if(len<0) return '0';
        var zero = '0';
        for(var i=0;i<len;i++){
            zero+='0';
        }
        var result = zero+value;
        return result.substr(result.length-len,result.length);
    },

    trAddTd:function (tr,td) {
        tr.appendChild(td);
    },
    showMsgOnTd:function (msg,td,color,isAppend) {
        if(!!td){
            color = color||'black';
            isAppend=isAppend||false;
            if(isAppend){
                td.innerText += msg;
            }
            else{
                td.innerText = msg;
            }
            td.style.color = color;
        }
        else {
            console.log(msg);
        }
    }
};
var webMgr={
    //通道信息
    showChannelInfo:function (msg,type) {
        xmUtils.showMsgOnTd(msg,tdChannelInfo,'blue',true);
    },
    //通道滞留玩家信息
    showChannelplayer:function (msg,type) {
        xmUtils.showMsgOnTd(msg,tdChannelPlayer,'red',true);
    },

    //已淘汰玩家信息
    showOutInfo:function (msg,type) {
        xmUtils.showMsgOnTd(msg,tdOutPlayer,'red',true);
    },

    //当前玩家名次
    showplayerOrder:function (msg,type) {
        xmUtils.showMsgOnTd(msg,tdOrder,'blue');
    },
    //当前轮次
    showCurrentRound:function (msg,type) {
        xmUtils.showMsgOnTd(msg,tdRound);
    },

    //当前比赛详情
    showGameInfo : function (msg, type) {
        xmUtils.showMsgOnTd(msg+'\n',tdGameInfo,'blue',true);
    },


    higameInfo:function (msg) {
        xmUtils.showMsgOnTd(msg,tdHigameInfo,'blue',true);
    },

    //添加列表
    addGameMsg : function () {
        var table = document.getElementById('gameMsg');
        var tr = document.createElement('tr');
        tr.style.textAlign = "center";
        table.appendChild(tr);

        xmUtils.trAddTd(tr,tdRound=document.createElement('td'));
        tdRound.innerText = currentRound++;
        xmUtils.trAddTd(tr,tdGameInfo=document.createElement('td'));
        xmUtils.trAddTd(tr,tdChannelInfo=document.createElement('td'));
        xmUtils.trAddTd(tr,tdChannelPlayer=document.createElement('td'));
        xmUtils.trAddTd(tr,tdOutPlayer=document.createElement('td'));
        xmUtils.trAddTd(tr,tdOrder=document.createElement('td'));

        /////----------------------------HigameTd--------------//////
        xmUtils.trAddTd(tr,tdHigameInfo=document.createElement('td'));
        xmUtils.trAddTd(tr,tdHigameOut=document.createElement('td'));
        xmUtils.trAddTd(tr,tdHigameChannel=document.createElement('td'));
        xmUtils.trAddTd(tr,tdHigameOrder=document.createElement('td'));
    },

//add result
    addResult : function (msg) {
        var div = document.createElement('div');
        div.innerText = msg;
        div.style.color = 'blue';
        document.body.appendChild(div);
    }



};
///////////////////////////////////////////////////////////////

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
    this.isZX = false;
    this.isHigh = false;
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
       // showGameInfo('庄家座位号:'+idx,1);
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
        //showGameInfo('设置时间'+self.minS+'-'+self.maxS,1);
    };

    this.endGame = function () {
        self.status = 2;
        var idx = Math.floor(Math.random()*4);
        self.updateScore(idx);
        console.log('idx : ',idx);
        var e = new Event(self.isHigh?'higameEnd':'gameEnd');
        e.tableId = self.id;
        document.dispatchEvent(e);
    };

    this.setChance=function (chance) {
        //showGameInfo(chance);
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
        webMgr.showGameInfo('桌号'+self.id+'比赛结果:\n',0);
        var base = self.base||100;
        var multiple=[8,16,32,64,128];
        var randomResult = self.getResultByChance()-1;
        if(randomResult<0)
        {
            webMgr.showGameInfo('流局',1);
            return;
        }
        console.log(self.players);
        var score = base*multiple[randomResult];
        var huZ = self.players[idx].gameHero==0;
        for(var i=0;i<total;i++){
            var isZ = self.players[i].gameHero==0?true:false;
            isZ=self.isZX?isZ:false;
            huZ = self.isZX?huZ:false;
            var preMsg='(座位号'+i+')'+self.players[i].toString();
            if(i==idx)
            {

                var won = self.isZX?(isZ?score*3:(score*2/8+score)):score*3/8;
                self.players[i].score = Number(self.players[i].score)+Number(won);
                webMgr.showGameInfo((isZ?'庄家:':'闲家:')+preMsg+'+'+won,0);
            }
            else{
                var lost = isZ?score:(huZ?score:score/8);
                self.players[i].score -= lost;
                webMgr.showGameInfo((isZ?'庄家:':'闲家:')+preMsg+'-'+lost,0);
            }

        }
    };
};

var highGame = {

    players:[],
    outPlayers:[],
    tables:[],

    minScores:[200,300,700,800,1000],

    addPlayer:function (player) {
        this.players.push(player);
        webMgr.higameInfo('进入高分局:'+JSON.stringify(player)+'\n');
    },
    addTable:function (table) {
        this.tables.push(table);
    },
    getMinScore:function () {
        return this.minScores[currentRound-2];
    },

    playersSort:function () {
        //if(this.players.length<4) return false;
    },

    tableStart:function () {

    },

    start:function () {
        this.playersSort();
        this.tableStart();
    }


};
//游戏管理类
var GameMgr = function (playerNum,minScore) {
    var self = this;
    var date = null;
    var sec = NaN;
    var totalTime = NaN;
    this.players=[];
    this.outPlayers=[];
    this.tables=[];
    this.minScore = minScore||500;
    this.playersNum=playerNum||16;
//玩家的设置
    this.addPlayer = function (player) {
        if(Number(player.score)<self.minScore)
        {
            //showGameInfo('玩家分数:'+player.score+',淘汰分数:'+self.minScore);
            self.outPlayers.push(player);
            webMgr.showGameInfo('玩家'+player.id+'积分'+player.score+'已被淘汰...',1);
            webMgr.showOutInfo(player.toString()+'\n');
            return console.log('玩家'+player.id+'积分'+player.score+'已被淘汰...');
        }
        if(Number(player.score)<highGame.getMinScore()||true){
            webMgr.showChannelInfo('进入晋级通道,'+player.toString()+'\n');
            self.players.push(player);
        }
        else {
            console.log('进入高分局:'+JSON.stringify(player));
            highGame.addPlayer(player);
        }

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
        webMgr.addGameMsg();
        date = new Date();
        webMgr.showGameInfo('游戏开始时间:'+date);
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
        webMgr.showGameInfo('桌子'+tableId+'游戏已经结束........正在清理桌面');
            self.clearTable(tableId);
            sec = (new Date()-date)/1000;
            webMgr.showGameInfo('本轮耗时,'+sec+'分钟');
            totalTime+=sec;
            self.checkPlayers();
    };


    this.checkHigame = function () {

        console.log('checkHigame');
         self.players.sort(function (a,b) {
            return b.score-a.score;
         });
        webMgr.higameInfo('本轮高分局最低分为'+highGame.getMinScore()+'\n');
         while ((!!self.players[0])&&self.players[0].score>=highGame.getMinScore()){
             highGame.addPlayer(self.players[0]);
             self.players.shift();
         }
    },

    this.checkPlayers = function (isRestart) {
        isRestart = isRestart||false;
        self.showPlayers();
        if(self.players.length>=4&&self.isAllTableFree()){
            self.showOrder();
            //self.checkHigame();
            if(!isRestart) return;
            webMgr.addGameMsg();
            date = new Date();
            webMgr.showGameInfo('游戏开始时间:'+date);
            while(!!(self.getFreeTable())&&self.players.length>=4)
            {
                var table = self.getFreeTable();
                table.addPlayer(self.players[0]);
                self.players.shift();
                table.addPlayer(self.players[0]);
                self.players.shift();
                table.addPlayer(self.players[0]);
                self.players.shift();
                table.addPlayer(self.players[0]);
                self.players.shift();
                self.showPlayers();
                table.setHero();
                table.startGame();
            }
            if(self.players.length<4)
            {
                var msg = '';
                for(idx in self.players)
                    msg+=self.players[idx].toString()+'\n';
                webMgr.showChannelplayer(msg);
            }
        }
        else
        {
            self.dealResult();
            //self.showOrder();
        }
    };

    this.showPlayers=function () {
       // showGameInfo('通道还有'+self.players.length+'玩家等待:',0);
        var msg = '';
        for(idx in self.players){
        //    showGameInfo(self.players[idx].toString(),0);
            msg += self.players[idx].toString()+'\n';
        }
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
        var result = '比赛已经结束,';
        self.players.sort(function (p1,p2) {
           return p2.score-p1.score;
        });
        var dateend = new Date();
        result+='游戏结束时间:'+new Date()+'\n';
        //sec = (new Date()-date)/1000;
        //totalTime+=sec;
        //result+='本次比赛耗时'+totalTime+'秒,折合实际时间约'+totalTime+'分钟'+'\n';
        for(var i=0;i<self.players.length;i++){
            result+='第'+(i+1)+'名:'+self.players[i].toString()+'\n';
        }

        for(var j=self.outPlayers.length,k=self.players.length+1;j>0;j--){
            result+='第'+(k++)+'名:'+self.outPlayers[j-1].toString()+'\n';
        }
        webMgr.addResult(result);
    };


    this.showOrder = function () {
        var order='';
        self.players.sort(function (a,b) {
            return b.score-a.score;
        });
        console.log('players=', self.players);
        for(var i=0;i< self.players.length;i++){
            order+='第'+(i+1)+'名:'+ self.players[i].toString()+'\n';
        }
        webMgr.showplayerOrder(order);
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

    this.isAllTableFree=function () {
        for(idx in self.tables)
        {
            if(self.tables[idx].status!==0)
                return false;
        }
        return true;
    }
};




var main = function (playerNum,baseScore,base,minScore,chance,isZX) {

    playerNum = playerNum||16;
    baseScore = baseScore||1000;
    base = base||100;
    minScore = minScore||500;
    var minS = 120;
    var maxS = 180;
    if(!!isZX){
        isZX = true;
    }else
        isZX = false;
    console.log({playerNum:playerNum,baseScore:baseScore,base:base,minScore:minScore});
    if(playerNum%4!==0||playerNum<4) console.log('比赛人数必须为4的倍数,请检查后确定',1);
    //showGameInfo('开始参数:'+'参赛人数='+playerNum+',初试分数='+baseScore+',麻将基础分='+base+',淘汰分数='+minScore,0);
    if(!!chance){
        chance.cPass=chance.cPass||3;
        chance.cBase=chance.cBase||55;
        chance.cOne=chance.cOne||30;
        chance.cTwo=chance.cTwo||9;
        chance.cThree=chance.cThree||3;
    }
    if(!!game){
        game.minScore = minScore;
        for(idx in game.tables)
        {
            game.tables[idx].setBase(base);
        }
        game.checkPlayers(true);
        return;
    }
    else
         game = new GameMgr(playerNum,minScore);
    for(var i=0;i<playerNum/4;i++){
        var table = new Table(i,4);
        table.isZX = isZX;
        table.setBase(base);
        table.setChance(chance);
        table.setTime(minS,maxS);
        table.addPlayer(new Player(xmUtils.addZero(i*4+1,4),baseScore));
        table.addPlayer(new Player(xmUtils.addZero(i*4+2,4),baseScore));
        table.addPlayer(new Player(xmUtils.addZero(i*4+3,4),baseScore));
        table.addPlayer(new Player(xmUtils.addZero(i*4+4,4),baseScore));
        game.addTable(table);
    }
        game.startGame();
};
