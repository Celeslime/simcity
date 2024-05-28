document.getElementById('inputs');
document.getElementById('return').addEventListener('click', function(){
    window.location.replace(document.referrer);
});
document.getElementById('clear').addEventListener('click', clearLevels);
document.getElementById('set0').addEventListener('click', setLevelsToZero);
var levels = new Array(data.length).fill(0);
var inputs = [];
if(localStorage.getItem('levels') != null){
    levels = JSON.parse(localStorage.getItem('levels'));
}
var temList = [];
for(var i = 0; i < data.length; i++){
    var initialValue = levels[i];
    var inputElement = createInputElement(data[i].name, initialValue);
    temList.push(inputElement);
    // document.getElementById('inputs').appendChild(inputElement);
}
for(let i in temList){
    document.getElementById('inputs').appendChild(temList[i]);
}
showScore();
function createInputElement(dataName, initialValue){
    var inputDiv = document.createElement('div');
    inputDiv.setAttribute('class','input box');

    var inputSpan = document.createElement('span');

    var headDiv = document.createElement('div');
    headDiv.setAttribute('class','head');
    headDiv.innerHTML = dataName;

    var tipSpan = document.createElement('span');
    tipSpan.setAttribute('class','result-tip box');

    var numInputDiv = document.createElement('div');
    numInputDiv.setAttribute('class','num-input box-group-T');

    var plusBtn = document.createElement('button');
    plusBtn.setAttribute('class','btn box plus');
    plusBtn.innerHTML = '+';
    plusBtn.onclick = function(e){
        var value = parseInt(e.target.nextElementSibling.value);
        e.target.nextElementSibling.value = Math.floor(value) + 1;
        save();
    }

    var minusBtn = document.createElement('button');
    minusBtn.setAttribute('class','btn box minus');
    minusBtn.innerHTML = '-';
    // 不小于0
    minusBtn.onclick = function(e){
        var value = e.target.previousElementSibling.value;
        if(value > 0){
            e.target.previousElementSibling.value = Math.ceil(value) - 1;
        }
        save();
    }

    var input = document.createElement('input');
    input.setAttribute('class','box');
    input.setAttribute('type','number');
    input.setAttribute('name',dataName);
    input.setAttribute('value',initialValue);
    inputs.push(input);
    
    numInputDiv.appendChild(plusBtn);
    numInputDiv.appendChild(input);
    numInputDiv.appendChild(minusBtn);
    
    headDiv.appendChild(tipSpan);

    inputDiv.appendChild(inputSpan);
    inputDiv.appendChild(headDiv);
    inputDiv.appendChild(numInputDiv);
    
    return inputDiv;
}
function showScore(){
    var tipSpan = document.getElementsByClassName('result-tip');
    for(var i=0; i<tipSpan.length; i++){
        var sc = getLevelScore(i, levels[i]);
        tipSpan[i].innerHTML = sc.toFixed()+'分';
    }
}
function save(){
    for(var i in inputs){
        levels[i] = Number(inputs[i].value);
    }
    localStorage.setItem('levels',JSON.stringify(levels));
    showScore();
}
function clearLevels(){
    if(confirm('确认恢复为默认等级信息？')){
        localStorage.removeItem('levels');
        window.location.replace(document.referrer);
    }
}
function setLevelsToZero(){
    if(confirm('确认将所有等级设为0级？')){
        for(var i in inputs){
            inputs[i].value = 0;
        }
        save();
    }
}