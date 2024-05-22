var outputDiv = document.getElementById('outputDiv');
var copyText = document.getElementById('copyText');

var temp, loading = 0; 
var inputs = [], maxCost = [];
var num = getUnit(data.length, 0)

var own = JSON.parse(localStorage.getItem("own"));
if(own == null) own = [];
if(own.length != 12) own = getUnit(12,0);

for(var i = 0; i < data[0].value.length; i++){
    var initialValue = (own.length != 0) ? own[i] : 0;
    var inputElement = createInputElement(dataNames[i], initialValue);
    document.getElementById('inputs').appendChild(inputElement);
}
// document.getElementById('startBtn').addEventListener('click',start);
document.getElementById('copyBtn').addEventListener('click', copyFn);
start()
/*
    算法改进史，1000战资：
        14700
        14710
        14717
        14747 算法更新！
        14903 直达九霄！
        14912 冲向终点！
        14932 抵达终点！


    未知bug，在这里记录：
        1. 某些数据的计算结果会出现大量负数
            未完全修复：调整了卡牌位置
        2. 减少战资反而分数上升
            未修复
*/
function start(){
    freshMaxCost();
    var num = getWarBest(maxCost);
    // console.log(num,maxCost);
    num = num.slice(0,24)
    show(num);
}
function show(u){
    var num = u.map((x)=>(Math.floor(x + 0.05)));
    outputDiv.innerHTML = '';
    copyText.innerHTML = '';

    // 显示卡牌
    outputDiv.appendChild(
        getSpan('总计：'+(getScore(num)*100).toFixed(0)+'/'+(getScore(u)*100).toFixed(0)+'分', 'tips')
    );
    copyText.innerHTML += '可使用卡牌：<br>';
    for(var i = 0;i < num.length;i++){
        if(num[i] != 0){
            outputDiv.appendChild(
                getSpan(data[i].name + ' × ' + num[i])
            );
            copyText.innerHTML += ' '+getPureText(data[i].name + ' × ' + getPureNum(num[i]) +'<br>');
        }   
    }

    // 显示可选的卡牌
    var collectCards = [];
    for(var i = 0;i < num.length; i++){
        var rate = u[i] - num[i];
        collectCards.push({
            id: i,
            rate: rate
        });
    }
    collectCards.sort(function(a, b){
        return b.rate - a.rate;
    })
    for(var i = 0;i < collectCards.length; i++){
        var rate = (collectCards[i].rate * 100).toFixed(0);
        if(rate < 10) break;
        if(i == 0){
            outputDiv.appendChild(getSpan(
                '可选：'+((getScore(u)-getScore(num))*100).toFixed(0)+'/'+(getScore(u)*100).toFixed(0)+'分','tips'
            ));
        }
        outputDiv.appendChild(getSpan(rate + '% ' + data[collectCards[i].id].name, 'card'));
    }

    // 显示剩余战资数量
    var tipSpans = document.getElementsByClassName('result-tip');
    var cost = calcCost(num)
    for(var i = 0; i < cost.length; i++){
        tipSpans[i].innerHTML = '';
        if((maxCost[i] - cost[i]) != 0){
            tipSpans[i].appendChild(getSpan('余'+(maxCost[i]-cost[i]),'remain box'));
        }
    }

    if(mode != 19)return;// 否则线性规划算法小概率卡死

    // 显示偏增量 +
    var maxScore = 0;
    var maxId = 0;
    var scores = [];
    for(var i = 0; i < maxCost.length; i++){
        var temList = maxCost.concat()
        temList[i] += 1;
        var temScore = getScore(getWarBest(temList).slice(0,24)) * 100;
        if(temScore >= maxScore){
            maxScore = temScore;
            maxId = i;
        }
        scores.push(temScore);
    }
    // 显示偏增量 -
    var minScore = 0;
    var minId = 0;
    var scores = [];
    for(var i = 0; i < maxCost.length; i++){
        var temList = maxCost.concat()
        temList[i] -= 1;
        if(temList[i] < 0)continue;
        var temScore = getScore(getWarBest(temList).slice(0,24)) * 100;
        if(temScore >= minScore){
            minScore = temScore;
            minId = i;
        }
        scores.push(temScore);
    }
    if(maxId != minId){
        tipSpans[maxId].appendChild(getSpan('缺','trade box'));
        copyText.innerHTML += '缺少战资：' + getPureText(dataNames[maxId]) + '<br>';
        if(maxCost[minId] != 0){
            tipSpans[minId].appendChild(getSpan('余','trade box'));
            copyText.innerHTML += '多余战资：' + getPureText(dataNames[minId]) + '<br>';
        }
    }
    

}
function getSpan(text, className = 'card'){
    var span = document.createElement('span');
    span.className = className;
    span.innerHTML = text;
    return span;
}
function freshMaxCost(){
    for(var i=0;i<inputs.length;i++){
        maxCost[i] = Number(inputs[i].value);
        if(window.location.host === '127.0.0.1'){
            // maxCost[i] = Math.floor(20*Math.random());// @测试
        }
        if(maxCost[i] < 0){
            maxCost[i] = 0;
        }
        inputs[i].value = maxCost[i];
    }
    localStorage.setItem('own',JSON.stringify(maxCost));
}
function setMaxCost(val){
    for(var i=0;i<inputs.length;i++){
        inputs[i].value = val[i];
    }
}
function getScore(list){
    var ans = 0;
    for(var i = 0; i < list.length; i++){
        ans += list[i] * data[i].score;
    }
    return ans;
}
function calcCost(num){
    var ans = getUnit(data[0].value.length, 0)
    for(var i = 0; i < num.length; i++){
        if(num[i] == 0){
            continue;
        }
        for(var j = 0;j < ans.length; j++){
            ans[j] += data[i].value[j] * num[i];
        }
    }
    return ans;
}
function copyFn(){
    var val = document.getElementById('copyText');
    window.getSelection().selectAllChildren(val);
    document.execCommand ("Copy");
    var copyBtn = document.getElementById('copyBtn');
    copyBtn.value = '完成';
    setTimeout(function(){
        copyBtn.value = '复制';
    },2000);
}
function getPureText(text){
    return text.replace(/日/g,'曰').replace(/霖/g,'-霖');
}
function getPureNum(num){
    return num.toFixed(0).replace(/15/g,'l5')
}
function getUnit(n,value){
    var list = []
    for(var i = 0; i < n; i++){
        list.push(value)
    }
    return list;
}
function createInputElement(dataName, initialValue){
    var inputDiv = document.createElement('div');
    inputDiv.setAttribute('class','input box');

    var inputSpan = document.createElement('span');

    var headDiv = document.createElement('div');
    headDiv.setAttribute('class','head');
    headDiv.innerHTML = dataName;

    var tipSpan = document.createElement('span');
    tipSpan.setAttribute('class','result-tip box-group');

    var numInputDiv = document.createElement('div');
    numInputDiv.setAttribute('class','num-input box-group');

    var plusBtn = document.createElement('button');
    plusBtn.setAttribute('id','plusBtn');
    plusBtn.setAttribute('class','btn box');
    plusBtn.innerHTML = '+';
    plusBtn.onclick = (e)=>(e.target.previousElementSibling.value++,start());

    var minusBtn = document.createElement('button');
    minusBtn.setAttribute('id','minusBtn');
    minusBtn.setAttribute('class','btn box');
    minusBtn.innerHTML = '-';
    // 不小于0
    minusBtn.onclick = (e)=>(e.target.nextElementSibling.value > 0 ? e.target.nextElementSibling.value-- : 0,start());

    var input = document.createElement('input');
    input.setAttribute('class','box');
    input.setAttribute('type','number');
    input.setAttribute('name',dataName);
    input.setAttribute('value',initialValue);
    inputs.push(input);
    
    numInputDiv.appendChild(minusBtn);
    numInputDiv.appendChild(input);
    numInputDiv.appendChild(plusBtn);

    headDiv.appendChild(tipSpan);

    inputDiv.appendChild(inputSpan);
    inputDiv.appendChild(headDiv);
    inputDiv.appendChild(numInputDiv);
    
    return inputDiv;
}