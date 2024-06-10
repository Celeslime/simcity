let raw_data = `
简称	弹药	铁砧	望远镜	消防栓	汽油	扩音器	老虎钳	疏通塞	螺旋桨	橡胶靴	橡胶鸭	医药包	默认	能量	分数
小手								1			1		3	1	100
收缩射线						2	1						2	3	300
巨石怪			1	1									2	2	200
人生地不熟		1							1				1	4	300
磁力		2	1	2									3	2	300
触手漩涡								1	2		1		3	3	200
V机器人	2				2								2	4	400
迪斯科						1	1		2				1	6	600
植物					2			2		2			3	4	400
冰风暴	2								1		3		2	6	600
死鱼				3						3	1		2	7	700
远古诅咒			3			2				1			1	8	800
死神之手	2						5				2		3	8	800
16吨		4		2			1						3	6	600
蜘蛛	5		2		1								2	9	900
舞鞋			3		2					2			1	10	1000
传送门				3				3	4				3	7	800
电影						2		2		2			1	8	1000
蟒蛇			2				3			3			2	6	800
怒吼						4	3		4				2	8	1100
鸭叫											10		1	8	100
电击之神		3			3	3							1	6	300
破盾					5							1	2	7	700
天降甘霖	3	3	2										3	6	700
`.split('\n');
let rows = [];
var data = [], mode, defualtLevels = [];
for(var i=2;i<raw_data.length;i++){
    if(raw_data[i]==''){continue;}
    rows[i] = raw_data[i].split('\t');
    data.push({
        name: rows[i][0],
        value: rows[i].slice(1,13).map(Number),
        power: Number(rows[i][14]),
        baseScore: Number(rows[i][15])
    });
    defualtLevels.push(Number(rows[i][13]));
}
if(localStorage.getItem('levels') == null){
    localStorage.setItem('levels',JSON.stringify(defualtLevels));
}
var levels = JSON.parse(localStorage.getItem('levels'));
var dataNames = raw_data[1].split('\t').slice(1);
function getLevelScore(id, level){
    if(!level)return 0;
    if(level == 1){return data[id].baseScore;}
    else if(level < 1){return 0;}
    if(data[id].name=='破盾'){return 700+150*(level-1)}
    return Math.round(1.1*getLevelScore(id,level-1)/5)*5;
}