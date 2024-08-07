var outputDiv = document.getElementById('outputDiv');
var copyText = document.getElementById('copyText');

var num;
var temp, loading = 0; 
var maxCost = [], deletedCard = [];
var inputs = [], plusBtns = [], minusBtns = [];

var own;
if(localStorage.getItem("own") != null){
    own = JSON.parse(localStorage.getItem("own"));
}
else{
    own = new Array(12).fill(0);
}

for(var i = 0; i < data[0].value.length; i++){
    var initialValue = (own.length != 0) ? own[i] : 0;
    var inputElement = createInputElement(dataNames[i], initialValue);
    document.getElementById('inputs').appendChild(inputElement);
}
document.getElementById('copyBtn').addEventListener('click', copyFn);
document.getElementById('freshBtn').addEventListener('click', function(){start(true);});
document.getElementById('setBtn').addEventListener('click', function(){window.location.href = "./settings";});
document.getElementById('mode0').onclick = changeMode;
document.getElementById('mode1').onclick = changeMode;
document.getElementById('mode2').onclick = changeMode;
changeMode();

// service worker
// navigator.serviceWorker.register('./serviceWorker.js', {scope: './'})
// 	.then(function (registration) {
// 		console.log('Service Worker 注册成功 with scope: ', registration.scope);
// 	})
// 	.catch(function (err) {
// 		// alert('Service Worker 注册失败: ', err);
// 		console.log('Service Worker registration failed: ', err);
// 	});

// 注销servive worker
navigator.serviceWorker.getRegistrations().then(function(registrations) {
    console.log(registrations);
    for(let registration of registrations) {
        
        registration.unregister();

    }
})

function changeMode(){
    mode = Number(document.querySelector('input[name="mode"]:checked').value);
    if(mode == 64){
        // 简单防护
        var password=null, checkword = "MTkyNjA4MTc=";
        if(localStorage.getItem("password") != null){
            password = localStorage.getItem("password");
        }
        if(password != checkword){
            password = prompt("请输入测试邀请码");
        }
        if(password == "" || password == null ){
            return;
        }
        else if(password != checkword){
            alert("邀请码错误");
            return;
        }
        else{
            localStorage.setItem("password", password);
        }
    }
    for(var i = 0; i < data.length; i++){
        var sc = getLevelScore(i, levels[i]);
        if(data[i].name == '鸭叫'){sc *= 25;}
        else if(data[i].name == '电击之神'){sc *= 3;}
        if(mode == 2){
            if(data[i].name == '鸭叫'){sc *= 26/25;}
            else if(data[i].name == '电击之神'){sc *= 4/3;}
            else{sc *= 2;}
        }
        if(mode == 0){
            if(data[i].name == '鸭叫'){sc = 0;}
            else if(data[i].name == '电击之神'){sc = 0;}
            else if(data[i].name == '破盾'){sc /= 2;}
            sc *= (getLevelScore(i,1)/100/data[i].power)**1;
        }
        data[i].score = sc;
    }
    start();
}
function start(refresh = false){
    freshMaxCost();
    num = getWarBest(maxCost,refresh)
        .map(function(x){
            var exRate = 1e5;
            return Math.round(x*exRate)/exRate;
        });
    show(num);
}
function show(num){
    var score  = getScore(num);
    var cost = calcCost(num);
    outputDiv.innerHTML = '';
    copyText.innerHTML = '';

    // 显示卡牌
    var cardSpans = [];
    var rank = getWarBest(new Array(12).fill(1)).slice(0,24);
    for(var i in rank){
        rank[i] *= data[i].score;
    }
    // console.log(rank);
    for(let i = 0;i < data.length;i++){
        if(num[i] != 0 || deletedCard.indexOf(i) != -1){
            cardSpans.push({
                id: i,
                card: creatCardSpan(i,num),
                value: Math.floor(num[i]),
                power: Math.floor(num[i])*data[i].power,
                cost: data[i].value.reduce((sum,j)=>(sum+j),0)*num[i],
                rank: rank[i]
            })
        }   
    }
    cardSpans.sort((a,b)=>(b.rank-a.rank));
    var sumPower = cardSpans.reduce((sum,i)=>(sum+i.power),0);
    if(sumPower==0){
        outputDiv.appendChild(getSpan(`总计：${score.toFixed()}分`, 'tips'));
    }
    else
        outputDiv.appendChild(getSpan(`总计：${score.toFixed()}分 <i>⚡${sumPower}</i>`, 'tips'));
    copyText.innerHTML += '组卡器组卡：<br>';
    var flag = true;
    for(var i=0;i<cardSpans.length;i++){
        if(cardSpans[i].rank!=0)
            outputDiv.appendChild(cardSpans[i].card);
        else{
            if(flag){
                flag=false
                // outputDiv.appendChild(getSpan(`预备`, 'tips'));
            }
            outputDiv.appendChild(cardSpans[i].card);
        }
        if(cardSpans[i].value!=0)
            copyText.innerHTML+=getPureText(data[cardSpans[i].id].name+' × '+cardSpans[i].value.toFixed(0)+'<br>');
    }

    // 显示多余卡牌
    var tipSpans = document.getElementsByClassName('result-tip');
    
    

    // 显示增量
    var temScores1 = [];
    var maxScore1 = 0,minScore1 = Infinity;
    for(var i = 0; i < maxCost.length; i++){
        var temList = maxCost.concat()
        temList[i] += 1;
        // console.log("id:",i);
        var temScore = 0;
        if(Math.round((maxCost[i]-cost[i])*10) <= 0) 
            temScore = getScore(getWarBest(temList)) - score;
        temScores1.push(temScore);
        maxScore1 = Math.max(maxScore1, temScore);
        minScore1 = Math.min(minScore1, temScore);
    }
    var temScores2 = [];
    var maxScore2 = 0,minScore2 = Infinity;
    for(var i = 0; i < maxCost.length; i++){
        var temList = maxCost.concat()
        temList[i] -= 1;
        if(temList[i] < 0)temList[i] = 0;
        // console.log("id:",i);
        var temScore = 0;
        if(Math.round((maxCost[i]-cost[i])*10) <= 10) 
            temScore = getScore(getWarBest(temList)) - score;
        temScores2.push(temScore);
        maxScore2 = Math.max(maxScore2, temScore);
        minScore2 = Math.min(minScore2, temScore);
    }
    
    for(var i in temScores2){
        plusBtns[i].innerHTML = '+'+temScores1[i].toFixed(0);
        if(temScores2[i].toFixed(0)[0]!='-')
            minusBtns[i].innerHTML = '-'+temScores2[i].toFixed(0);
        else
            minusBtns[i].innerHTML = temScores2[i].toFixed(0);
        // tipSpans[i].innerHTML = '';
        // if(Math.abs(temScores1[i]+temScores2[i]) <= 2 && Math.round(temScores1[i].toFixed(0)) != 0){
        //     var span = getSpan('±'+temScores1[i].toFixed(0),'pink')
        //     span.style.opacity = (temScores1[i]-minScore1)/(maxScore1-minScore1)*0.9+0.1;
        //     tipSpans[i].appendChild(span);

        // }
        // else{
        //     if(temScores2[i] < -1){
        //         var span = getSpan(''+temScores2[i].toFixed(0),'yellow')
        //         span.style.opacity = 1.1+0.9*(temScores2[i]-maxScore2)/(maxScore2-minScore2);
        //         tipSpans[i].appendChild(span);
        //     }
        //     if(temScores1[i] > 1){
        //         var span = getSpan('+'+temScores1[i].toFixed(0),'pink');
        //         span.style.opacity = (temScores1[i]-minScore1)/(maxScore1-minScore1)*0.9+0.1;
        //         tipSpans[i].appendChild(span);
        //     }
        // }
        // if(Math.round((maxCost[i]-cost[i])*10) > 0){
        //     tipSpans[i].appendChild(getSpan('余'+(maxCost[i]-cost[i]).toFixed(1),'red'));
        // }
    }
}

function freshMaxCost(){
    for(var i=0;i<inputs.length;i++){
        maxCost[i] = Number(inputs[i].value);
        if(window.location.host === '127.0.0.1'){
            // maxCost[i] = 1000;Math.floor(10*Math.random());// @测试
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
    for(var i = 0; i < data.length; i++){
        ans += list[i] * data[i].score;
    }
    return ans;
}
function calcCost(num){
    var ans = new Array(12).fill(0);
    for(var i = 0; i < data.length; i++){
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
function getPureText(note){
    var text = note;
    // 防止词语被游戏屏蔽
    return text
        .replace(/日/g,'曰')
        .replace(/甘霖/g,'甘!霖')
        .replace(/服务/g,'服雾')
        .replace(/15/g,'1@5')
        .replace(/购买/g,'兑换')
        .replace(/升天/g,'升@天')
        .replace(/is/g,'i@s')
        .replace(/鞯/g,'荐')
        .replace(/贱/g,'荐')
}
function getSpan(text, className = 'card'){
    var span = document.createElement('span');
    span.className = className;
    span.innerHTML = text;
    return span;
}
function createInputElement(dataName, initialValue){
    // 好讨厌DOM啊！！！
    var inputDiv = document.createElement('div');
    inputDiv.setAttribute('class','input');

    var headDiv = document.createElement('div');
    headDiv.setAttribute('class','head box-group');
    // headDiv.innerHTML = dataName;

    // var tipSpan = document.createElement('span');
    // tipSpan.setAttribute('class','result-tip box');

    var numInputDiv = document.createElement('div');
    numInputDiv.setAttribute('class','num-input box-group');

    var input = document.createElement('input');
    input.setAttribute('class','box');
    input.setAttribute('type','number');
    input.setAttribute('name',dataName);
    input.setAttribute('value',initialValue);
    inputs.push(input);

    var img = document.createElement('img');
    img.setAttribute('class','box');
    img.setAttribute('src','./styles/items/' + dataName + '.png');
    headDiv.appendChild(img);
    headDiv.appendChild(input);
    var plusBtn = document.createElement('button');
    plusBtn.setAttribute('class','btn box plus');
    plusBtn.innerHTML = '+';
    plusBtn.onclick = (e)=>(input.value++,start());
    plusBtns.push(plusBtn);

    var minusBtn = document.createElement('button');
    minusBtn.setAttribute('class','btn box minus');
    minusBtn.innerHTML = '-';
    // 不小于0
    minusBtn.onclick = function(e){
        if(input.value > 0){
            input.value--;
        }
        start();
    }
    minusBtns.push(minusBtn);

    
    
    numInputDiv.appendChild(minusBtn);
    numInputDiv.appendChild(plusBtn);

    // headDiv.appendChild(tipSpan);

    inputDiv.appendChild(headDiv);
    inputDiv.appendChild(numInputDiv);
    // 设置inputDiv伪元素after backgroundImage为'url(./styles/items/' + dataName + '.png)'
    // inputDiv.style.setProperty('--after','url(./items/' + dataName + '.png)');


    
    return inputDiv;
}
function creatCardSpan(i,num){
    var spanText = `
        <div class="left ${num[i] < 1?'disable':''}">
            <span class="adjust-btn box minus" onclick=turnCard(${i},-1)>-</span>
            <span class="text">${data[i].name}<span class="small">⚡${data[i].power}</span></span>
        </div>
        <div class="right">
    `
    if(Math.floor(num[i])!=0)
        spanText+=`
            <span class="power">× ${Math.floor(num[i])}</span>
        `;
    else
        spanText+=`
            <span class="power opacity">${Math.floor(num[i]*100)}%</span>
        `;
    spanText+=`
            <span class="adjust-btn box plus" onclick=turnCard(${i},1)>+</span>
        </div>
    `
    var cardSpan = getSpan(spanText, 'card');
    return cardSpan;
}
function turnCard(i,n){
    if(num[i] + n < 0){
        return;
    }
    for(var j in maxCost){
        maxCost[j] += data[i].value[j] * n;
    }
    deletedCard.push(i);
    setMaxCost(maxCost)
    start();
}