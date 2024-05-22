let raw_data = `
名称/物资	弹药	铁砧	望远镜	消防栓	汽油	扩音器	老虎钳	疏通塞	螺旋桨	橡胶鞋	橡胶鸭	医疗箱	头奖*2.5	伤害个数	分数	双倍	钥匙	等级	最终分数
B级电影怪兽						2		2		2			1.56	1.60	10	20	16	1	20.00
人生地不熟		1							1				0.47	5.33	3	6	16	1	6.00
死神之手	2						5				2		1.25	2.00	8	16	4	1.211628548	19.39
巨石怪			1	1									0.31	8.00	2	4	8	1.10074	4.40
破盾					5							1	-1.09	-2.29	7	14	8	1.10074	15.41
末日蜘蛛	5		2		1								1.41	1.78	9	18	8	1.10074	19.81
V机器人	2				2								0.63	4.00	4	8	8	1.10074	8.81
16吨		4		2			1						0.94	2.67	6	12	4	1.211628548	14.54
迪斯科旋风						1	1		2				0.94	2.67	6	12	16	1	12.00
传送门				3				3	4				1.25	2.00	8	16	4	1.211628548	19.39
舞鞋			3		2					2			1.56	1.60	10	20	16	1	20.00
蟒蛇			2				3			3			1.25	2.00	8	16	8	1.10074	17.61
死鱼之灾				3						3	1		1.09	2.29	7	14	8	1.10074	15.41
滑稽之手								1			1		0.16	16.00	1	2	4	1.211628548	2.42
天降甘霖	3	3	2										1.09	2.29	7	14	4	1.211628548	16.96
收缩射线						2	1						0.47	5.33	3	6	8	1.10074	6.60
远古诅咒			3			2				1			1.25	2.00	8	16	16	1	16.00
号角						4	3		4				1.72	1.45	11	22	8	1.10074	24.22
触手								1	2		1		0.31	8.00	2	4	4	1.211628548	4.85
冰风暴	2								1		3		0.94	2.67	6	12	8	1.10074	13.21
植物					2			2		2			0.63	4.00	4	8	4	1.211628548	9.69
磁铁		2	1	2									0.47	5.33	3	6	3	1.260869766	7.57
电击之神		3			3	3							0.00	5.33	9	12	16	1	12.00
末日鸭叫											10		0.00	16.00	25	26	16	1	26.00
`.split('\n');
let rows = [];
var data = [], mode = 19;
for(var i=2;i<raw_data.length;i++){
    if(raw_data[i]==''){continue;}
    rows[i] = raw_data[i].split('\t');
    data.push({
        name: rows[i][0],
        value: rows[i].slice(1,13).map(Number),
        score: Number(rows[i][mode]),
    });
}
var dataNames = raw_data[1].split('\t').slice(1);
// select mode
function changeMode(){
    mode = Number(document.querySelector('input[name="mode"]:checked').value);
    for(var i = 0; i < data.length; i++){
        data[i].score = Number(rows[i + 2][mode]);
    }
    start();
}
document.getElementById('mode1').onclick = changeMode;
document.getElementById('mode2').onclick = changeMode;
document.getElementById('mode3').onclick = changeMode;