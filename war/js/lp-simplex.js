/*
参考代码 Github @ https://github.com/SakurabaSeira/Simplex-Online
参考资料 Wikipedia @ https://zh.wikipedia.org/wiki/单纯形法

使用“单纯形法”求解“线性规划问题”
	对于不等式：
		a1x1 + a2x2 + a3x3 <= b1
		a4x1 + a5x2 + a6x3 <= b2
		a7x1 + a8x2 + a9x3 <= b3
	对目标函数求解最大值
		z = c1x1 + c2x2 + c3x3
	结果样例: 
		[x1,x2,x3,b1',b2',b3']
	无解返回false
*/

// 精度配置：防止因为精度原因出现BUG
const Zero = 1e-6;

// 输入标准A,b,c格式
function solveLP(A,b,c){
	var limit = new Array();
	for(var i=0;i<A.length;i++){
		limit[i] = [A[i],b[i]];
	}
    return getResult(c,limit);
}
function getResult(goal,limit){
	// Limit样例:
	// 	[[a1,a2,a3],b1],
	// 	[[a4,a5,a6],b2],
	// 	[[a7,a8,a9],b3],
	// Goal样例: 
	// 	[c1,c2,c3]
	//加入松弛变量，基变量和价值系数
	var loosen = getLoosen(limit,goal);
	//建立一个新矩阵 存储扩充后的决策变量及其价值系数
	var cb = [];
	for(var i=0;i<(goal.length+loosen.length);i++){
		//插入决策变量，基变量和价值系数
		cb.push([goal[i]||0,i]);
	}
	//初始化消除负数约束项
	while(true){
		//判断是否存在为负数项的约束条件
		var needAssist = false;
		for(var i of loosen){
			if(i[1] < 0){
				needAssist = true;
			}
		}
		//若不存在为负数项的约束条件 开始单纯形法运算
		if(!needAssist){
			break;
		}
		//如果存在，则需要使用对偶单纯形法消去负数项
		var min=0,min_index=null;
		//寻找b列值最小的负数项 决定换出变量
		for(var i=0;i<loosen.length;i++){
			if(loosen[i][1]<min){
				min = loosen[i][1];
				min_index = i;
			}
		}
		//在决定换出变量后 决定换入变量
		var min2=Infinity,min_index2=null;
		for(var i=0;i<cb.length;i++){
			var num = loosen[min_index][0][i];
			if(num >= 0) continue;
			var check = (getCheckNum(cb,loosen,i))/num;
			if(check < min2){
				min2 = check;
				min_index2 = i;
			}
		}
		if(typeof min_index2=='number'){
			//若成功寻找到换入变量 则对矩阵进行初等变换
			loosen[min_index][2] = min_index2;
			loosen[min_index][3] = cb[min_index2][0];
			updateMartix(loosen,min_index,min_index2);
		}
		//若找不到换入变量 则该矩阵不存在最优解 返回false值 结束函数运行
		else return false;
	}
	//进行单纯形法运算
	while(true){
		//Step1: 寻找正检验数
		var max_index = null;
		for(var i = 0; i < cb.length; i++){
			var check = getCheckNum(cb,loosen,i);
			//采取Bland规则 直接取下标最小的正检验数
			if(check > Zero){
				max_index = i;
				break;
			}
		}
		//若已经不存在正检验数，则已经找到最优解
		if(max_index === null){
			break;
		}
		//Step2: 寻找最小比值数
		var min=Infinity,min_index=null,min_index2=null;
		for(var i=0;i<loosen.length;i++){
			var bizhi = getBizhiNum(cb,loosen,i,max_index);
			//若两个最小的比值数同时存在 则采取Bland规则 选择下标最小的一项
			if(typeof bizhi == 'number' && (bizhi<min || (bizhi==min&&loosen[i][2]<min_index2))){
				min=bizhi;
				min_index=i;
				min_index2=loosen[i][2];
			}
		}
		//Step3: 交换基向量
		if(typeof min_index == 'number'){
			//换入决策变量和价值系数
			loosen[min_index][2]=max_index;
			loosen[min_index][3]=cb[max_index][0];
			//对矩阵进行初等变换
			updateMartix(loosen,min_index,max_index);
		}
	}
	//使用一维数组表示最优结果
	var result=new Array(cb.length).fill(0);
	//将b列的值读取入该数组
	for(var i of loosen){
		result[i[2]]=i[1];
	}
	//返回该数组
	return result;
}
//插入松弛变量，决策变量和价值系数
function getLoosen(limit,goal){
	for(var i=0;i<limit.length;i++){
		//插入松弛变量
		for(var j=0;j<limit.length;j++){
			limit[i][0].push(i==j?1:0);
		}
		//插入决策变量
		limit[i].push(i+goal.length);
		//插入价值系数
		limit[i].push(0);
	}
	return limit;
}
//获取检验数σ
function getCheckNum(cb,loosen,index){
	var num = cb[index][0];
	for(var i=0;i<loosen.length;i++){
		num -= loosen[i][3] * loosen[i][0][index];
	}
	return num;
}
//使用比值判别法 获取比值数θ
function getBizhiNum(cb,loosen,index,maxIndex){
	var num = loosen[index][0][maxIndex];
	//若系数为负 则该行不可能被换出 返回null
	if(num <= Zero){
		return null;
	}
	return loosen[index][1]/num;
}
//进行初等行变换，转化为基向量
function updateMartix(loosen,index1,index2){
	var list = loosen[index1];
	var num = list[0][index2];
	//通过乘除法 将该中心点的值归一化
	for(var i=0;i<list[0].length;i++){
		list[0][i] /= num;
	}
	list[1]/=num;
	//通过加减法 清除中心点所在列的值
	for(var i=0;i<loosen.length;i++){
		if(i == index1) continue;
		var num2 = loosen[i][0][index2];
		for(var j=0;j<loosen[i][0].length;j++){
			loosen[i][0][j] -= (loosen[index1][0][j]*num2);
		}
		loosen[i][1] -= loosen[index1][1]*num2;
	}
}