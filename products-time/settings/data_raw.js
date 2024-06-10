var rawData = `
id	商店	商品名称	时间	价格	钢	木	塑	种	矿	药	布	糖	玻	肥	芯	钉子	木板	砖块	水泥	胶水	油漆	锤子	尺子	铲子	锅铲	梯子	钻头	蔬菜	面粉	西瓜	黄油	玉米	奶酪	牛排	椅子	桌子	被子	柜子	沙发	草	树苗	布椅	火坑	割草机	地精	甜甜圈	冰沙	面包	红蛋糕	冰淇淋	咖啡	帽子	鞋	表	西服	背包	巧克力	披萨	汉堡	薯条	饮料	爆米花	烤架	冰箱	灯泡	电视机	微波炉
0	0	金属	1	10	x																																																														
1	0	木材	3	20		x																																																													
2	0	塑料	9	25			x																																																												
3	0	种子	20	30				x																																																											
4	0	矿物质	30	40					x																																																										
5	0	化学物质	120	60						x																																																									
6	0	纺织品	180	80							x																																																								
7	0	糖和香料	240	110								x																																																							
8	0	玻璃	300	120									x																																																						
9	0	动物饲料	360	130										x																																																					
10	0	电子元件	420	140											x																																																				
11	1	钉子	5	80	2											x																																																			
12	1	木板	30	120		2											x																																																		
13	1	砖块	20	190					2									x																																																	
14	1	水泥	50	440					2	1									x																																																
15	1	胶水	60	440			1			2										x																																															
16	1	油漆	60	320	2				1	2											x																																														
17	2	锤子	14	90	1	1																x																																													
18	2	尺子	20	110	1		1																x																																												
19	2	铲子	30	150	1	1	1																	x																																											
20	2	厨具	45	250	2	2	2																		x																																										
21	2	梯子	60	420	2												2									x																																									
22	2	钻机	120	590	2		2								2												x																																								
23	3	蔬菜	20	160				2																				x																																							
24	3	面粉	30	570				2			2																		x																																						
25	3	西瓜	90	730				2																						x											1																										
26	3	奶油	75	440										1																	x																																				
27	3	玉米	60	280				4	1																							x																																			
28	3	奶酪	105	660										2																			x																																		
29	3	牛排	150	860										3																				x																																	
30	4	椅子	20	300		2										1						1													x																																
31	4	桌子	30	500												2	1					1														x																															
32	4	被子	75	610							2												1														x																														
33	4	柜子	45	900									2				2				1																	x																													
34	4	沙发	150	1810							3									1							1												x																												
35	5	草	30	310				1																1																x																											
36	5	树苗	90	420				2																1																	x																										
37	5	布椅	135	820			2				2						2																									x																									
38	5	火坑	240	1740														2	2					1																			x																								
39	5	割草机	120	840	3										1						1																							x																							
40	5	地精	90	1600															2	1																									x																						
41	6	甜甜圈	45	950								1																	2																	x																					
42	6	冰沙	30	1150																								1		1																	x																				
43	6	面包卷	60	1840																									2		1																	x																			
44	6	红蛋糕	90	2240																									1	1			1																x																		
45	6	冻酸奶	240	1750								1																		1	1																			x																	
46	6	咖啡	60	750				2				1																			1																				x																
47	7	帽子	60	600							2												1																													x															
48	7	鞋子	75	980			1				2									1																																	x														
49	7	手表	90	580			2			1			1																																									x													
50	7	西服	210	1170							3									1			1																																x												
51	7	背包	150	430			2				2												1																																	x											
52	8	巧克力	14	2560																											1																	1									x										
53	8	披萨	24	1920																									1				1	1																								x									
54	8	汉堡	35	3620																														1														1											x				1				
55	8	薯条	20	1050																								1					1																											x							
56	8	柠檬汁	60	1690								2	2																	1																															x						
57	8	爆米花	30	1250																												2																														x					1
58	9	烤架	165	530	3																				1																																						x				
59	9	冰箱	210	1060			2			2					2																																																	x			
60	9	灯泡	105	890						1			1		1																																																		x		
61	9	电视机	150	1280			2						2		2																																																			x	
62	9	微波炉	120	480	4								1		1																																																				x
`.split('\n');

var dataAll = new Array();
var data = new Array();
for(var i of rawData){
    var temdata = i.split('\t').map(dataToNum);
    if(i=='' || temdata[0]=='id')continue;
    dataAll.push({
        id: temdata[0],
        type: temdata[1],
        name: temdata[2],
        time: temdata[3],
        price: temdata[4],
        value: temdata.slice(5,)
    })
}
var dataNames=rawData[1].split('\t').slice(5,16).concat(['建材','五金','农贸','家具','园艺','甜品','时装','快餐','家电']);

for(var i=0;i<dataAll.length;i++){
    getBaseValues(i);
}
for(var i=0;i<data.length;i++){
    data[i].value=data[i].value.slice(0,11);
    if(i<11){
        // data[i].value[i] = 1;
    }

    data[i].value=data[i].value.concat(data[i].time.slice(1,));
    if(i<11){
        data[i].value[i] = 1;
    }
    // 预览
    // data[i].score /= getTime(data[i].value);
    // if(data[i].score < 250)data[i].score=0;
}
data = data.slice(11,)




var cost = [
    30,30,30,
    20,20,10,
    5,5,5,5,5
]


function getTime(list){
    let time = 0;
    for(let i in list){
        time += list[i] * dataAll[i].time;
    }
    return time;
}
function dataToNum(i){
    if(i=='x')i = 0;
    var n = Number(i);
    if(isNaN(n)){
        return i;
    }
    return n;
}
// 获取累加的基本原料
function getBaseValues(id){
    if(data[id]){
        return data[id];
    }
    var baseValue = dataAll[id].value.concat();
    var time = new Array(10).fill(0);
    time[dataAll[id].type]=dataAll[id].time;
    for(var i=11;i<dataAll[id].value.length;i++){
        if(dataAll[id].value[i] != 0){
            let dataT = getBaseValues(i);
            baseValue = addList(baseValue,dataT.value,dataAll[id].value[i]);
            time = addList(time, dataT.time, dataAll[id].value[i]) ;
        }
    }
    data[id]={
        value: baseValue,
        score: dataAll[id].price ,//- getBasePrice(baseValue),// **********
        name: dataAll[id].name,
        time: time,
    };
    return data[id];
}
function getBasePrice(list){
    let sum = 0;
    for(let i=0;i<list.length;i++){
        sum+=dataAll[i].price * list[i];
    }
    return sum;
}
//
function addList(list1, list2, time2 = 1){
    var list3 = new Array();
    for(var i=0;i<list1.length;i++){
        list3[i] = (list1[i] + list2[i] * time2);
    }
    return list3;
}
