var outputDiv = document.getElementById('outputDiv');
var copyText = document.getElementById('copyText');

var temp, loading = 0; 
var inputs = [], maxCost = [];
var num = getUnit(data.length, 0)

var own = JSON.parse(localStorage.getItem("own"));
if(own == null) own = getUnit(12,0);
if(!own[0]) own = getUnit(12,0);

for(var i = 0; i < data[0].value.length; i++){
    var input = document.createElement('input');
    var inputDiv = document.createElement('div');
    var inputSpan = document.createElement('span');
    inputSpan.innerHTML = dataNames[i];
    inputDiv.setAttribute('class','input');
    input.setAttribute('type','number');
    input.setAttribute('name',dataNames[i]);
    if(own.length != 0){
        input.setAttribute('value',own[i]);
    }
    else{
        input.setAttribute('value',0);
    }
    inputs[i] = input;
    inputDiv.appendChild(inputSpan);
    inputDiv.appendChild(input);
    document.getElementById('inputs').appendChild(inputDiv);
}
document.getElementById('startBtn').addEventListener('click',start);
document.getElementById('copyBtn').addEventListener('click', copyFn);
/*
        <1000战资个人纪录榜单>
    14700
    14710
    14717
    14747 算法更新！
    14903 直达九霄！
    14912 冲向终点！
    14932 抵达终点！
*/
function start(){
    freshMaxCost();
    num = getWarBest(maxCost).slice(0,24);
    show(num);
}
function show(u){
    var num = u.map((x)=>(Math.floor(x + 0.05)));
    outputDiv.innerHTML = '';
    copyText.innerHTML = '';
    outputDiv.appendChild(
        getSpan('总计：'+getScore(num)*100+'/'+Math.floor(getScore(u)*100)+'分', 'tips')
    );
    copyText.innerHTML += '总计：'+getPureNum(getScore(num)*100)+'分<br>';
    for(var i=0;i<num.length;i++){
        if(num[i] != 0){
            outputDiv.appendChild(
                getSpan(data[i].name + ' × ' + num[i])
            );
            copyText.innerHTML += getPureText(data[i].name + ' × ' + getPureNum(num[i]) +'<br>');
        }   
    }
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
        if(rate < 50) break;
        if(i == 0){
            outputDiv.appendChild(
                getSpan('可选：'+(Math.floor(getScore(u)*100)-getScore(num)*100)+'/'+Math.floor(getScore(u)*100)+'分', 'tips')
            );
        }
        outputDiv.appendChild(getSpan(rate + '% ' + data[collectCards[i].id].name, 'card'));
    }
    var cost = calcCost(num)
    for(var i = 0; i < cost.length; i++){
        if((maxCost[i] - cost[i]) != 0){
            inputs[i].previousSibling.innerHTML = 
                dataNames[i] + '<span>余' + (maxCost[i] - cost[i]) +'</span>';
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
            maxCost[i] = Math.floor(20*Math.random());// @测试
        }
        if(maxCost[i] < 0){
            maxCost[i] = 0;
        }
        inputs[i].value = maxCost[i];
    }
    localStorage.setItem('own',JSON.stringify(maxCost));
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
    copyText.style.display = 'block';
    window.getSelection().selectAllChildren(val);
    document.execCommand ("Copy");
    var copyBtn = document.getElementById('copyBtn');
    copyBtn.value = '✔️';
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