data;
//num尝试从localStorage
var num = JSON.parse(localStorage.getItem("num"))
if(num == null){
    num = getUnit(data.length, 0)
}


var temp = 0.5;
var loading = 0;
var inputs = [];



function getUnit(n,value){
    var list = []
    for(var i=0;i<n;i++){
        list.push(value)
    }
    return list;
}
function calcCost(num){
    var ans = getUnit(data[0].value.length, 0)
    for(var i=0;i<num.length;i++){
        ans = addList(ans, multList(data[i].value,num[i]))
    }
    return ans;
}
function multList(list, num){
    var ans = [];
    for(var i=0;i<list.length;i++){
        ans.push(list[i] * num);
    }
    return ans;
}
function addList(list1, list2){
    var ans = [];
    for(var i=0;i<list1.length;i++){
        ans[i] = list1[i] + list2[i];
    }
    return ans;
}
function supList(list1, list2){
    var ans = [];
    for(var i=0;i<list1.length;i++){
        ans[i] = list1[i] - list2[i];
    }
    return ans;
}
function addOne(num){
    var maxCost = getMaxCost();
    var remainCost = supList(maxCost, calcCost(num))
    var check = checkRemain(remainCost);
    var randId = Math.ceil(Math.random()*check[1]);
    if(check[1] == 0)
        return false;
    for(var i=0;i<check[0].length;i++){
        if(check[0][i]){
            randId--;
            if(randId == 0){
                num[i]++;
                return true;
            }
        }
    }
}
function addToFull(num){
    while(addOne(num)){};
    return num;
}
function checkRemain(remainCost){
    var ans = [];
    var count = data.length;
    for(var i=0;i<data.length;i++){
        var flag = true;
        for(var j=0;j<data[i].value.length;j++){
            if(remainCost[j] < data[i].value[j]){
                flag = false;
                count--;
                break;
            }
        }
        ans.push(flag);
    }
    return [ans,count];
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
    var tempNum = num;
    tempNum = zipList(num, temp);
    addToFull(tempNum);
    if(getScore(num) < getScore(tempNum)){
        num = tempNum;
        // console.log(Math.floor(temp*100)+'%',getScore(num));
        loading = 0;
    }
    else{
        loading++;
    }
    return num;
}
function start(){
    num = num = getUnit(data.length, 0);
    var av = getAverage()
    console.log(av)
    temp = 0.5;
    while(true){
        num = getBetterList(num);
        if(loading > 2000){
            temp = 1 - (1-temp)/1.1;
            loading -= 20;
            if(temp >= 1-1e-10 )break;
        }
    }
    // console.log('计算完毕，最后修正细节')
    for(var i = 0; i < 1e5; i++){
        temp = 1;
        num = getBetterList(num);
    }
    show(num);
}
function getAverage(){
    var sum=0;
    for(var i=0;i<100;i++){
        var list = zipList(num,0)
        addToFull(list)
        sum += getScore(list)
    }
    return sum/100;
}
// 13760 [101, 69, 304, 148, 299, 92, 44, 26, 210, 96, 0, 117, 16, 101, 101, 1, 0, 100, 11, 99, 113, 89, 0, 0]
// 14537 [102, 70, 390, 220, 320, 101, 0, 0, 465, 0, 0, 170, 6, 59, 122, 2, 0, 0, 0, 86, 116, 42, 1, 0]
// 14687 [154, 83, 402, 196, 420, 0, 65, 0, 566, 0, 0, 145, 0, 47, 81, 0, 0, 0, 0, 39, 152, 8, 0, 0]
function show(num){
    outputP.innerHTML = '';
    for(var i=0;i<num.length;i++){
        if(num[i] != 0){
            // console.log(data[i].name,num[i])
            outputP.innerHTML += data[i].name + ': ' + num[i] + '<br>';
        }
    }
    outputP.innerHTML += '总计：'+getScore(num)*100+'分';

    var remainCost = calcCost(num)
    console.log('remain',remainCost)
    for(var i=0;i<remainCost.length;i++){
        inputs[i].previousSibling.innerHTML = dataNames[i]+'：'+ (-remainCost[i]);
    }
}



for(var i=0;i<data[0].value.length;i++){
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
function getMaxCost(){
    var maxCost = [];
    for(var i=0;i<inputs.length;i++){
        maxCost[i] = Number(inputs[i].value);
    }
    localStorage.setItem('own',JSON.stringify(maxCost));
    return maxCost;
}
document.getElementById('startBtn').addEventListener('click',function(){
    var time = 0;
        outputP.innerHTML = '计算已经开始，受设备算力与数据量影响，计算时间通常小于30s，请稍等...';
    setTimeout(start, 10);
});
var outputP = document.getElementById('consoleLog');