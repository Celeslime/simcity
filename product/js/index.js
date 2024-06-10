// 初始化数据
const data = readData(rawData);
const buildingName = ['工厂','建材','五金','农贸','家具','园艺','甜品','时装','快餐','家电']
// 准备好dom，初始化echarts
var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom, 'vintage');
// 指定图表的配置项和数据
var listMax = 0;
var graph = dataToGraph(data);
var option = {
    title: {
        text: '商品生产压力 - 模拟，启动！Q:7797 50526',
        top: 10,
        left: 'center',
    },
    legend: {
        selectedMode: false,
        bottom: 10,
    },
    tooltip: {
        
    },
    toolbox: {
        feature: {
            saveAsImage: {
                pixelRatio: 5,
            }
        }
    },
    series: [
      {
        // name: 'simcity',
        type: 'graph',
        data: graph.nodes,
        links: graph.links,
        categories: graph.categories,
        roam: true,
        edgeSymbol: ['none', 'arrow'],
        edgeSymbolSize: 6,
        draggable: true,
        // 排列方式三选一：自定，力，圆形
        layout: ['none','force','circular'][0],
        // force: {
        //     repulsion: 200,
        //     // layoutAnimation: false,
        //     initLayout: 'circle',
        // },
        label: {
            show: true,
            position: 'top',
            formatter: '{b}',
            textBorderColor: 'inherit',
            textBorderWidth: 2,
            color: '#fff',
        },
        emphasis: {
            focus: 'adjacency',
        },
        lineStyle: {
            color: 'source',
            // 连线小弧度
            curveness: 0
        }
      }
    ],
  };
// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);
// 数据转化
function dataToGraph(data){
    var graph = {
        nodes: [],
        links: [],
        categories: []
    };
    var symbolData = function(){
        var list=[];
        for(var i=0;i<63;i++){
            var baseValue = getBaseValues(i);
            var baseTime=0;
            for(var j=0;j<baseValue.length;j++){
                if(baseValue[j] != 0){
                    var temTime=(baseValue[j])*data[j].time;
                    baseTime+=temTime;
                }
            }
            
            list[i] = data[i].cost / (baseValue).reduce((sum,i)=>(sum+i),0) / baseTime;
            // list[i] = baseTime;
            // if(i<11)list[i]=0;
        }
        return list;
    }();
    var depthCounter = [10,4.5,4,14,13.5];
    for(var i=0;i<data.length;i++){
        var depth = getProductDepth(i);
        var node = {
            id: i,
            name: data[i].name,
            value: symbolData[i],
            symbolSize: 40 * normalizeSymbolSize(symbolData, i),
            category: data[i].type,
            x: depthCounter[depth]++,
            y: depth*2.8
        };
        graph.nodes.push(node);
    }
    for(var i=0;i<data.length;i++){
        for(var j=0;j<data[i].value.length;j++){
            if(data[i].value[j] != 0){
                graph.links.push({
                    source: j,
                    target: i,
                    // value: data[i].value[j]
                });
            }
        }
    }
    for(var i=0;i<10;i++){
        graph.categories.push({
            name: buildingName[i],
            itemStyle: {
                // color: '#0f0',
            }
        });
    }
    return graph;
}
// 归一化处理
function normalizeSymbolSize(list, i){
    if(listMax == 0){
        for(var j=0;j<list.length;j++){
            if(list[j]!=Infinity)
                listMax = (listMax>list[j]?listMax:list[j]);
        }
    }
    return (i<11?1:1) * list[i]/listMax;
}




// 获取累加的基本原料
function getBaseValues(id){
    var baseValue = data[id].value.concat();
    for(var i=11;i<data[id].value.length;i++){
        if(data[id].value[i] != 0){
            baseValue = addList(baseValue,getBaseValues(i),data[id].value[i]);
        }
    }
    return baseValue;
}
// 获取累加的时间
function getAddTime(id){
    var baseTime = data[id].time;
    for(var i=0;i<data[id].value.length;i++){
        if(data[id].value[i] != 0){
            if(i < 11)
                baseTime = baseTime + getAddTime(i)*data[id].value[i]/5;
            else
                baseTime = baseTime + getAddTime(i)*data[id].value[i];
        }
    }
    return baseTime;
}
// 获取实际最大时间
function getCostTimes(id){
    var allProducts = new Array(data.length).fill(0);
    allProducts[id] = 1;
    var costTimes = getAllProduced(allProducts);
    var maxTime = 0;
    for(var i in costTimes){
        costTimes[i] *= data[i].time;
        if(i<11)costTimes[i]/=500;
    }
    var li=new Array(20).fill(0);
    for(var i in costTimes){
        li[data[i].type]+=costTimes[i];
    }
    return li.reduce((max,a)=>(Math.max(max,a)));
}
// 获取商品成本价值
function getProductsCost(id){
    var cost = 0;
    for(var i=0;i<data[id].value.length;i++){
        if(data[id].value[i] != 0){
            cost += data[id].value[i] * data[i].cost;
        }
    }
    return cost;
}
// 所有商品
function allProducts(){
    var list = [];
    for(var i=0;i<11;i++){
        list[i] = 0;
    }
    for(var i=11;i<63;i++){
        list[i] = 1;
    }
    return list;
}
// 各种商品净生产1份时，所需要生产的所有商品
function getAllProduced(products = allProducts()){
    var sum = products;
    for(var i=0;i<63;i++){
        if(products[i] != 0){
            sum = addList(sum,getAllProduced(data[i].value),products[i]);
        }
    }
    return sum;
}
// 生产压力：各种商品净生产1份时，各种商品的数量*生产时间/min
function getProductsPressure(){
    // 这些参数在正常范围内对数据外观影响不大，暂不做细致探究
    let onlineTime = 0;// 持续在线时间/min
    let offlineTime = 0;// 持续离线时间/min
    let delayTime = offlineTime / 2; // 延迟时间：人因参数/min，约为离线时间的一半
    var realTime = function(id){
        return data[id].time + delayTime * (data[id].time > onlineTime)
    };

    var pressure = getAllProduced();
    for(var i=0;i<63;i++){
        pressure[i] *= realTime(i);
    }
    return pressure;
}
// 生产深度：对大生产层数
function getProductDepth(id){
    var maxDepth = 0;
    for(var i=0;i<63;i++){
        if(data[id].value[i] != 0){
            maxDepth = Math.max(maxDepth, getProductDepth(i) + 1);
        }
    }
    return maxDepth;
}
// 生产点击次数
function getClickCount(id){
    var clickCount = 1;
    for(var i=0;i<63;i++){
        if(data[id].value[i] != 0){
            clickCount += getClickCount(i) * data[id].value[i];
        }
    }
    return clickCount;
}
// List相加
function addList(list1, list2, time2 = 1){
    var list3 = [];
    for(var i=0;i<list1.length;i++){
        list3[i] = (list1[i] + list2[i] * time2);
    }
    return list3;
}
// 根据名称获取ID
function getId(text){
    return data.findIndex(x => x.name === text);
}
// 初始化数据
function readData(rawData){
    var data = [];
    let data_text = []
    let data_row = rawData;
    for(var i=0;i<data_row.length;i++){
        if(data_row[i].length == 0){
            continue;
        }
        var text = data_row[i].split("\t")
        data_text.push(text);
        var temp_data = text.map(dataToNum);
        var item = {
            "type" : temp_data[1],
            "name" : temp_data[2],
            "time" : temp_data[3],
            "value" : temp_data.slice(5,68),
            "cost": temp_data[4],
        }
        if(!isNaN(item.type)){
            data.push(item);
        }
    }
    return data;
}
function dataToNum(num){
    if(num == 'x'){
        num = 0;
    }
    if(Number(num) >= 0){
        num = Number(num);
    }
    return num;
}