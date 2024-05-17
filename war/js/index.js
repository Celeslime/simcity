var temp, loading; 
var inputs = [], maxCost = [], num = [];

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
function zipList(list, num){
    var ans = [];
    for(var i=0;i<list.length;i++){
        var t = Math.floor(list[i]*num) - 1
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
        console.log(Math.floor(temp*100)+'%',getScore(num));
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
    temp = 0.5;
    while(true){
        num = getBetterList(num);
        if(loading > 2000){
            temp = 1 - (1-temp)/1.1;
            loading -= 20;
            if(temp >= 1-1e-10 )break;
        }
    }
    fixResult(1e5);
    show(num);
}
function fixResult(n = 1e5){
    console.log('离散修正')
    for(var i = 0; i < n; i++){
        temp = 1;
        num = getBetterList(num);
    }
}
function getAverage(){
    var sum=0;
    for(var i = 0; i < 1e4; i++){
        var list = zipList(num,0)
        addToFull(list)
        sum += getScore(list)
    }
    return sum/1e4;
}
// 1000战资个人纪录
// 14700 10*[53, 41, 44, 15, 18, 15, 0, 14, 5, 0, 10, 0, 4, 8, 0, 0, 2, 0, 0, 3, 0, 0, 0, 0]
// 14710 10*[65, 43, 56, 13, 14, 12, 0, 11, 4, 0, 10, 0, 4, 8, 0, 0, 10, 0, 0, 1, 0, 0, 0, 0]
function show(num){
    outputDiv.innerHTML = '';
    var flag = true;
    var listSpan = document.createElement('span');
    listSpan.className = 'tips';
    listSpan.innerHTML = '总计：'+getScore(num)*100+'分';
    outputDiv.appendChild(listSpan)
    
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
            // outputP.innerHTML += data[i].name + ' × ' + num[i] + '<br>';
        }   
    }

    var remainCost = calcCost(num)
    console.log('remain',remainCost)
    for(var i=0;i<remainCost.length;i++){
        inputs[i].previousSibling.innerHTML = dataNames[i]+'<span>'+ (-remainCost[i])+'</span>';
    }
}
function freshMaxCost(){
    for(var i=0;i<inputs.length;i++){
        maxCost[i] = Number(inputs[i].value);
        // maxCost[i] = Math.floor(200*Math.random());//测试

        if(maxCost[i] < 0)maxCost[i] = 0;
        inputs[i].value = maxCost[i];
    }
    localStorage.setItem('own',JSON.stringify(maxCost));
}
function copyFn(){
    var val = document.getElementById('outputDiv');
    window.getSelection().selectAllChildren(val);
    document.execCommand ("Copy");
    var copyBtn = document.getElementById('copyBtn');
    copyBtn.value = '✔️';
    setTimeout(function(){
        copyBtn.value = '复制';
    },2000);
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