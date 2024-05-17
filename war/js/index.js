var temp, loading = 0; 
var inputs = [], maxCost = [], num = [];
var own = JSON.parse(localStorage.getItem("own"));
if(own==null)own = getUnit(12,0);
if(!own[0] && own[0] != 0)own = getUnit(12,0);

function getUnit(n,value){
    var list = []
    for(var i = 0; i < n; i++){
        list.push(value)
    }
    return list;
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
function multList(list, num){
    var ans = [];
    for(var i = 0; i < list.length; i++){
        ans.push(list[i] * num);
    }
    return ans;
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
function addToFull(num){
    while(addOne(num)){};
}
function addOne(num){
    var check = checkRemain(num);
    if(check.length == 0){
        return false;
    }
    var randId = check[Math.floor(Math.random() * check.length)];
    num[randId]++;
    return true;
}
function checkRemain(num){
    var remainCost = supList(maxCost, calcCost(num))
    var ans = [];
    for(var i = 0; i < data.length; i++){
        var flag = true;
        for(var j = 0; j < data[i].value.length; j++){
            if(remainCost[j] < data[i].value[j]){
                flag = false;
                break;
            }
        }
        if(flag){
            ans.push(i);
        }
    }
    return ans;
}
var artList = getUnit(data.length, 0);// 至此，已成艺术
for(var i = 0; i < data.length; i++){
    for(var j = 0; j < data[0].value.length; j++){
        artList[i] += data[i].value[j]; 
    }
    artList[i] = 11 / artList[i];
}
function zipList(list, rate){
    var ans = [];
    for(var i=0;i<list.length;i++){
        var t = Math.floor(list[i] - artList[i] * (Math.random() > rate))
        // var t = Math.floor(list[i] * rate) - 1;// 收敛速度慢
        ans[i] = t>0?t:0;
    }
    return ans;
}
function getScore(list){
    var ans = 0;
    for(var i=0;i<list.length;i++){
        ans += list[i] * data[i].score;
    }
    return ans;
}
function getBetterList(num){
    var tempNum = zipList(num, temp);
    addToFull(tempNum);
    if(getScore(num) < getScore(tempNum)){
        num = tempNum;
        console.log(Math.floor(temp * 100)+'%',getScore(num));
        loading = 0;
    }
    else{
        loading++;
    }
    return num;
}
function start(){
    num = getUnit(data.length, 0);
    freshMaxCost();
    temp = 0;
    while(true){
        num = getBetterList(num);
        if(loading > 10000){
            temp = 1 - (1 - temp) / 1.1;
            if(temp >= 0.5)break;
            loading = 0;
        }
    }
    show(num);
}
function freshMaxCost(){
    for(var i=0;i<inputs.length;i++){
        maxCost[i] = Number(inputs[i].value);
        // maxCost[i] = 100//Math.floor(200*Math.random());//测试
        if(maxCost[i] < 0)maxCost[i] = 0;
        inputs[i].value = maxCost[i];
    }
    localStorage.setItem('own',JSON.stringify(maxCost));
}
// 1000战资个人纪录
// 14700
// 14710
// 14717
function show(num){
    outputDiv.innerHTML = '';
    copyText.innerHTML = '';
    var flag = true;
    var listSpan = document.createElement('span');
    listSpan.className = 'tips';
    listSpan.innerHTML = '总计：'+getScore(num)*100+'分<br>';
    outputDiv.appendChild(listSpan)
    copyText.innerHTML+='总计：'+SectionToChinese(getScore(num)*100)+'分<br>';
    
    for(var i=0;i<num.length;i++){
        if(num[i] != 0){
            if(i > 8 && flag){
                listSpan = document.createElement('span');
                listSpan.className = 'tips';
                listSpan.innerHTML = '以下卡牌可能不适合囤积战资：'
                outputDiv.appendChild(listSpan)
                flag = false;
            }
            listSpan = document.createElement('span');
            listSpan.className = 'card';
            listSpan.innerHTML = data[i].name + ' × ' + num[i];
            outputDiv.appendChild(listSpan);
            copyText.innerHTML+=getPureText(data[i].name + ' × ' + num[i]+'<br>');
            // outputP.innerHTML += data[i].name + ' × ' + num[i] + '<br>';
        }   
    }

    var remainCost = calcCost(num)
    console.log('remain',remainCost)
    for(var i=0;i<remainCost.length;i++){
        inputs[i].previousSibling.innerHTML = dataNames[i]+'<span>'+ (-remainCost[i])+'</span>';
    }
}
function copyFn(){
    var val = document.getElementById('copyText');
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
document.getElementById('startBtn').addEventListener('click',function(){
    outputDiv.innerHTML = '计算已经开始，受设备算力与数据量影响，计算时间通常约5s，请稍等...';
    setTimeout(start, 10);
});
document.getElementById('copyBtn').addEventListener('click',copyFn);
var outputDiv = document.getElementById('outputDiv');
var copyText = document.getElementById('copyText');