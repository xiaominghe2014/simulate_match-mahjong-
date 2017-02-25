
const MJ = {
    W_1:0, W_2:1,W_3:2,W_4:3, W_5:4,W_6:5,W_7:6, W_8:7,W_9:8,
    T_1:9, T_2:10,T_3:11,T_4:12, T_5:13,T_6:14,T_7:15, T_8:16,T_9:17,
    S_1:18,S_2:19,S_3:20,S_4:21,S_5:22,S_6:23,S_7:24,S_8:25,S_9:26,
    E:27,S:28,W:29,N:30,C:31,FT:32,BLANK:33,
    M:34,L:35,Z:36,J:37,
    SPRING:38,SUMMER:39,AUTUMN:40,WINTER:41
};


const  MJRule = {
    //普通胡牌
    isNormalHu:function (paiArr) {
        if(paiArr.length!==14){
            return false;
        }
        let j = 0;
        let huaPai = 28;

        this.sortPaiArr(paiArr);
        for(let i=0,len = paiArr.length;i<len;){

            if(i+2<len){
                if(paiArr[i]===paiArr[i+1]&&paiArr[i]===paiArr[i+2]){
                    i+=3;
                    continue;
                }
                if(paiArr[i+2]<huaPai&&paiArr[i]===paiArr[i+1]-1&&paiArr[i]===paiArr[i+2]-2){
                    i+=3;
                    continue;
                }
                if(paiArr[i]===paiArr[i+1]&&paiArr[i]!==paiArr[i+2]){
                    j++;
                    if(j!==1){
                        return false;
                    }
                    i+=2;
                    continue;
                }
            }

            else if(i+1<len){
                if(paiArr[i]===paiArr[i+1]){
                    j++;
                    if(j!==1){
                        return false;
                    }
                    i+=2;
                    continue;
                }
            }
        }

        if(j===1){
            return true;
        }
        return false;
    },

    //七对胡
    is7Dui:function (paiArr) {
        if(paiArr.length!==14){
            return false;
        }
        this.sortPaiArr(paiArr);
        for(let i=0;i<7;i++){
            if(paiArr[2*i]===paiArr[2*i+1]){
                continue;
            }
            else{
                return false;
            }
        }
        return false;
    },

    //十三幺
    is13Yao:function (paiArr) {
        if(paiArr.length!==14){
            return false;
        }
        this.sortPaiArr(paiArr);
        let huArr = [MJ.W_1,MJ.W_9,MJ.T_1,MJ.T_9,MJ.S_1,MJ.S_9,MJ.E,MJ.S,MJ.W,MJ.N,MJ.C,MJ.BLANK];
        let tmpArr = paiArr.slice();
        for(let i=0,j=0;i<huArr.length;i++){
            if(tmpArr.indexOf(huArr[i])===-1){
                return false;
            }
            tmpArr.shift();
        }
        if(huArr.indexOf(tmpArr[0])===-1){
            return false;
        }
        return true;
    },

    sortPaiArr:function (arr) {
        arr.sort(function (a,b) {
            return a-b;
        });
    }
};