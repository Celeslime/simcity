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
for(var i = 0; i < data.length; i++){
    var initialValue = levels[i];
    var inputElement = createInputElement(data[i].name, initialValue);
    document.getElementById('inputs').appendChild(inputElement);
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
    plusBtn.setAttribute('class','btn box plus');
    plusBtn.innerHTML = '+';
    plusBtn.onclick = function(e){
        var value = parseInt(e.target.previousElementSibling.value);
        e.target.previousElementSibling.value = Math.floor(value) + 1;
        save();
    }

    var minusBtn = document.createElement('button');
    minusBtn.setAttribute('class','btn box minus');
    minusBtn.innerHTML = '-';
    // 不小于0
    minusBtn.onclick = function(e){
        var value = e.target.nextElementSibling.value;
        if(value > 0){
            e.target.nextElementSibling.value = Math.ceil(value) - 1;
        }
        save();
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

    inputDiv.appendChild(inputSpan);
    inputDiv.appendChild(headDiv);
    inputDiv.appendChild(numInputDiv);
    
    return inputDiv;
}
function save(){
    for(var i in inputs){
        levels[i] = Number(inputs[i].value);
    }
    localStorage.setItem('levels',JSON.stringify(levels));
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