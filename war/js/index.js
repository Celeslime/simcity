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
// navigator.serviceWorker.getRegistrations().then(function(registrations) {
//     console.log(registrations);
//     for(let registration of registrations) {
//         registration.unregister();
//     }
// })

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
    // copyText.innerHTML += '我可以发动的：<br>';
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
        
    // return;
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
        plusBtns[i].innerHTML  = '+' + Math.abs(temScores1[i]).toFixed(0) + '<i></i>';
        minusBtns[i].innerHTML = '<i></i>' + '-' + Math.abs(temScores2[i]).toFixed(0);
        minusBtns[i].style.opacity = 1.1+0.9*(temScores2[i]-maxScore2)/(maxScore2-minScore2);
        plusBtns[i].style.opacity = (temScores1[i]-minScore1)/(maxScore1-minScore1)*0.9+0.1;
    }
}

function freshMaxCost(){
    for(var i=0;i<inputs.length;i++){
        maxCost[i] = Number(inputs[i].value);
        if(window.location.host === '127.0.0.1'){
            // maxCost[i] = 10//;*Math.floor(10*Math.random());// @测试
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
    plusBtn.setAttribute('class','plus');
    plusBtn.innerHTML = '+';
    plusBtn.onclick = (e)=>(input.value++,start());
    plusBtns.push(plusBtn);

    var minusBtn = document.createElement('button');
    minusBtn.setAttribute('class','minus');
    minusBtn.innerHTML = '-';
    // 不小于0
    minusBtn.onclick = function(e){
        if(input.value > 0){
            input.value--;
        }
        start();
    }
    minusBtns.push(minusBtn);

    
    var btnBox1 = document.createElement('div');
    btnBox1.setAttribute('class','btn box');
    btnBox1.appendChild(plusBtn);
    
    var btnBox2 = document.createElement('div');
    btnBox2.setAttribute('class','btn box');
    btnBox2.appendChild(minusBtn);

    numInputDiv.appendChild(btnBox2);
    numInputDiv.appendChild(btnBox1);

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
// 复制高维度数组
function deepCopyArray(arr){
	if(Array.isArray(arr)){
		return arr.map(deepCopyArray);
	}
	return arr;
}
function getWarBest(cost, rand = false){
	var m = data[0].value.length; // 12
	var n = data.length; // 24
	var A = new Array(m);


	var order = [];
	for(var i=0;i<data.length;i++){
		order.push(i);
	}
	if(rand)order.sort(()=>(Math.random()-0.5));
	var temData = getDataByOrder(order);
	m=temData[0].value.length;

	for(var i=0;i<m;i++){
		A[i] = new Array();
	    for(var j=0;j<n;j++){
	        A[i][j] = temData[j].value[i];
	    }
	}
    var b = cost.concat();
	var mode = Number(document.querySelector('input[name="mode"]:checked').value);
	if(mode == 0){
		for(var i=0;i<24;i++){
			b.push(Math.floor(12/data[i].power));
		}
	}
	var c = new Array(n);
	for(var i=0;i<n;i++){
	    c[i] = temData[i].score;
	}
	var r=solveLP(A,b,c);
	// 将r按照order还原
	var result = [];
	for(var i=0;i<order.length;i++){
		result.push(r[order.indexOf(i)]);
	}
	for(var i=order.length;i<r.length;i++){
		result.push(r[i]);
	}
    return result;
}
function getDataByOrder(order){
	var mode = Number(document.querySelector('input[name="mode"]:checked').value);
	var temData = new Array();
	for(var i=0;i<order.length;i++){
		var temD = {
			value: deepCopyArray(data[order[i]].value),
			score: data[order[i]].score,
		};
		if(mode == 0){
			var temA = new Array(24).fill(0);
			temA[order[i]] = 1;
			temD.value = temD.value.concat(temA);
		}
		temData.push(temD);
	}
	return temData;
}