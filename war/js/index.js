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
*/
function start(){
    num = getUnit(data.length, 0);
    var maxNum = num, maxNumScore = 0;
    freshMaxCost();
    for(temp = 1; temp > 1e-5; temp *= 0.999){
        num = zipList(num, 1 - temp);
        addBestOneToFull(num);
        if(getScore(num) > maxNumScore){
            maxNumScore = getScore(num);
            maxNum = num;
        }
        else{
            num = maxNum;
        }
    }
    num = maxNum;
    while(addBestOneToFull(num));
    show(maxNum);
}
function show(u){
    var num = u.map(Math.floor);
    outputDiv.innerHTML = '';
    copyText.innerHTML = '';
    var flag = true;
    var listSpan = document.createElement('span');
    listSpan.className = 'tips';
    listSpan.innerHTML = '生成评分：' + Math.floor(getScore(u)*100) + '分<br>总计：'+getScore(num)*100+'分';
    outputDiv.appendChild(listSpan)
    copyText.innerHTML += '总计：'+SectionToChinese(getScore(num)*100)+'分<br>';
    
    for(var i=0;i<num.length;i++){
        if(num[i] != 0){
            if(i > 8 && flag){
                listSpan = document.createElement('span');
                listSpan.className = 'tips';
                listSpan.innerHTML = '以下卡牌可能不适合囤积战资：'
                // outputDiv.appendChild(listSpan)
                flag = false;
            }
            listSpan = document.createElement('span');
            listSpan.className = 'card';
            listSpan.innerHTML = data[i].name + ' × ' + num[i];
            outputDiv.appendChild(listSpan);
            copyText.innerHTML += getPureText(data[i].name + ' × ' + num[i]+'<br>');
        }   
    }
    var remainCost = calcCost(num)
    for(var i=0;i<remainCost.length;i++){
        inputs[i].previousSibling.innerHTML = dataNames[i]+'<span>'+ (-remainCost[i])+'</span>';
    }
}
function addBestOneToFull(num){
    var remainCost = supList(maxCost, calcCost(num));
    var bestScore = 0, bestId, bestCount;
    for(var i = 0; i < data.length; i++){
        var min = Infinity;
        for(var j = 0; j < data[i].value.length; j++){
            if(remainCost[j] == 0 && data[i].value[j] == 0){
                continue;
            }
            min = Math.min(min, remainCost[j] / data[i].value[j]);
        }
        if(min * data[i].score > bestScore){
            bestScore = min * data[i].score;
            bestId = i;
            bestCount = min;
        }
    }
    if(bestScore == 0){
        return false;
    }
    num[bestId] += bestCount;
    return true;
}
function freshMaxCost(){
    for(var i=0;i<inputs.length;i++){
        maxCost[i] = Number(inputs[i].value);
        if(window.location.host === '127.0.0.1'){
            maxCost[i] = 1000;//Math.floor(50*Math.random());// @测试
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
function SectionToChinese(section){
    var chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
    var chnUnitChar = ["","十","百","千","万","亿","万亿","亿亿"];
    var strIns = '', chnStr = '';
    var unitPos = 0;
    var zero = true;
    if(section === 0) return chnNumChar[0];
    while(section > 0){
        var v = section % 10;
        if(v === 0){
             if(!zero){
                  zero = true;
                  chnStr = chnNumChar[v] + chnStr;
             }
        }else{
              zero = false;
              strIns = chnNumChar[v];
              strIns += chnUnitChar[unitPos];
              chnStr = strIns + chnStr;
        }
        unitPos++;
        section = Math.floor(section / 10);
     }
     return chnStr;
}
function getUnit(n,value){
    var list = []
    for(var i = 0; i < n; i++){
        list.push(value)
    }
    return list;
}
function addList(list1, list2){
    var ans = [];
    for(var i = 0; i < list1.length; i++){
        ans[i] = list1[i] + list2[i];
    }
    return ans;
}
function supList(list1, list2){
    var ans = [];
    for(var i = 0; i < list1.length; i++){
        ans[i] = list1[i] - list2[i];
    }
    return ans;
}
function zipList(list, rate){
    var ans = [];
    for(var i = 0; i < list.length; i++){
        ans[i] = list[i] * rate;
    }
    return ans;
}