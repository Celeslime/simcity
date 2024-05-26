var outputDiv = document.getElementById('outputDiv');
var copyText = document.getElementById('copyText');

var temp, loading = 0; 
var inputs = [], maxCost = [], deletedCard = [];
var num = new Array(data.length).fill(0);

var own = new Array(12).fill(0);
if(localStorage.getItem("own") != null){
    own = JSON.parse(localStorage.getItem("own"));
}

for(var i = 0; i < data[0].value.length; i++){
    var initialValue = (own.length != 0) ? own[i] : 0;
    var inputElement = createInputElement(dataNames[i], initialValue);
    document.getElementById('inputs').appendChild(inputElement);
}
document.getElementById('copyBtn').addEventListener('click', copyFn);
document.getElementById('freshBtn').addEventListener('click', freshFn);
document.getElementById('setBtn').addEventListener('click', setFn);
document.getElementById('mode2').onclick = changeMode;
document.getElementById('mode3').onclick = changeMode;
changeMode();
/*
    未知bug，在这里记录：
    1.某些数据的计算结果会出现大量负数
      - 未完全修复：设置了自动刷新
*/
function changeMode(){
    mode = Number(document.querySelector('input[name="mode"]:checked').value);
    for(var i = 0; i < data.length; i++){
        var sc = Number(rows[i + 2][mode]) * Math.pow(1.10074,levels[i]-1);
        if(levels[i] == 0){
            sc = 0;
        }
        data[i].score = sc;
    }
    start();
}
function start(refresh = false){
    var num;
    freshMaxCost();
    num = getWarBest(maxCost,refresh)
        .map(function(x){
            return Math.round(x*1e9)/1e9;
        });
    show(num);
}
function show(u){
    var num = u.map((x)=>(Math.floor(x + 0.05)));
    var scores = (getScore(u)*100).toFixed(0);
    var score  = (getScore(num)*100).toFixed(0);
    outputDiv.innerHTML = '';
    copyText.innerHTML = '';

    // 显示剩余战资数量
    var tipSpans = document.getElementsByClassName('result-tip');
    var cost = calcCost(u)
    for(var i = 0; i < cost.length; i++){
        tipSpans[i].innerHTML = '';
        if(Math.round((maxCost[i]-cost[i])*1e9) > 0){
            tipSpans[i].appendChild(getSpan('余'+(maxCost[i]-cost[i]).toFixed(1),'remain box'));
        }
    }
    
    // 显示卡牌
    outputDiv.appendChild(
        getSpan('总计：'+score+'/'+scores+'分', 'tips')
    );
    copyText.innerHTML += '可使用卡牌最优解：<br>';
    for(let i = 0;i < num.length;i++){
        if(num[i] != 0 || deletedCard.indexOf(i) != -1){
            var cardSpan = getSpan('', 'card');
            var textSpan = getSpan(data[i].name + ' × ' + num[i], 'text');
            var plusBtn = getSpan('+', 'adjust-btn box');
            plusBtn.addEventListener('click', function(){
                let id = i;
                for(var j in maxCost){
                    maxCost[j] += data[id].value[j];
                }
                setMaxCost(maxCost)
                start();
            })
            var minusBtn = getSpan('-', 'adjust-btn box');
            minusBtn.addEventListener('click', function(){
                let id = i;
                if(num[id] == 0)
                    return;
                for(var j in maxCost){
                    maxCost[j] -= data[id].value[j];
                }
                deletedCard.push(id);
                setMaxCost(maxCost)
                start();
            })
            if(num[i] == 0){
                minusBtn.className += ' disable';
            }
            cardSpan.appendChild(minusBtn);
            cardSpan.appendChild(textSpan);
            cardSpan.appendChild(plusBtn);

            outputDiv.appendChild(cardSpan);
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
            outputDiv.appendChild(
                getSpan('预备：'+(scores-score)+'/'+scores+'分','tips')
            );
        }
        outputDiv.appendChild(getSpan(rate + '% ' + data[collectCards[i].id].name, 'card'));
    }
    // 显示多余或缺少
    var idState = new Array(12).fill(0);
    // 缺少战资
    for(var i = 0; i < maxCost.length; i++){
        var temList = maxCost.concat()
        temList[i] += 1;
        var temScore = getScore(getWarBest(temList));
        idState[i] = temScore*100 - scores;
        if(idState[i] > 0)
            tipSpans[i].appendChild(getSpan('+'+idState[i].toFixed(0),'trade box'));
    }
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
    var ans = new Array(12).fill(0);
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
}
function freshFn(){
    start(true);
}
function setFn(){
    window.location.href = "./settings";
}
function getPureText(note){
    var text = note;
    text = text.replace(/日/g,'曰');
    text = text.replace(/甘霖/g,'甘!霖');
    text = text.replace(/服务/g,'服雾');
    return text;
}
function getPureNum(num){
    return num.toFixed(0).replace(/15/g,'1@5')
}
function getSpan(text, className = 'card'){
    var span = document.createElement('span');
    span.className = className;
    span.innerHTML = text;
    return span;
}
function createInputElement(dataName, initialValue){
    var inputDiv = document.createElement('div');
    inputDiv.setAttribute('class','input box');

    var headDiv = document.createElement('div');
    headDiv.setAttribute('class','head');
    headDiv.innerHTML = dataName;

    var tipSpan = document.createElement('span');
    tipSpan.setAttribute('class','result-tip box-group');

    var numInputDiv = document.createElement('div');
    numInputDiv.setAttribute('class','num-input box-group');

    var plusBtn = document.createElement('button');
    plusBtn.setAttribute('class','btn box plus');
    plusBtn.innerHTML = '+';
    plusBtn.onclick = (e)=>(e.target.previousElementSibling.value++,start());

    var minusBtn = document.createElement('button');
    minusBtn.setAttribute('class','btn box minus');
    minusBtn.innerHTML = '-';
    // 不小于0
    minusBtn.onclick = function(e){
        var value = e.target.nextElementSibling.value;
        if(value > 0){
            e.target.nextElementSibling.value--;
        }
        start();
    }

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

    inputDiv.appendChild(headDiv);
    inputDiv.appendChild(numInputDiv);
    
    return inputDiv;
}