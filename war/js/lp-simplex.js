//port from Github @ https://github.com/SakurabaSeira/Simplex-Online





















function getResult(goal,limit){
	//调用getLoosen函数 将原先的限制条件矩阵进行扩充
	//加入松弛变量，基变量和价值系数
	var loosen=getLoosen(limit,goal);
	//建立一个新矩阵 存储扩充后的决策变量及其价值系数
	var cb=[];
	for(var i=0;i<(goal.length+loosen.length);i++){
		//插入决策变量，基变量和价值系数
		cb.push([goal[i]||0,i]);
	}
	while(true){
		//判断是否存在为负数项的约束条件
		var needAssist=false;
		for(var i of loosen){
			if(i[1]<0){
				needAssist=true;
			}
		}
		//如果存在，则需要使用对偶单纯形法消去负数项
		if(needAssist){
			var min=0,min_index=null;
			//寻找b列值最小的负数项 决定换出变量
			for(var i=0;i<loosen.length;i++){
				if(loosen[i][1]<min){
					min=loosen[i][1];
					min_index=i;
				}
			}
			//在决定换出变量后 决定换入变量
			var min2=Infinity,min_index2=null;
			for(var i=0;i<cb.length;i++){
				var num=loosen[min_index][0][i];
				if(num>=0) continue;
				var check=(getCheckNum(cb,loosen,i))/num;
				if(check<min2){
					min2=check;
					min_index2=i;
				}
			}
			if(typeof min_index2=='number'){
				//若成功寻找到换入变量 则对矩阵进行初等变换
				loosen[min_index][2]=min_index2;
				loosen[min_index][3]=cb[min_index2][0];
				updateMartix(loosen,min_index,min_index2);
			}
			//若找不到换入变量 则该矩阵不存在最优解 返回false值 结束函数运行
			else return false;
		}
		//若不存在为负数项的约束条件 则结束循环判断 转向单纯形法运算
		else break;
	}
	//进行单纯形法的操作步骤
	while(true){
		//判断是否存在正的检验数
		var max=0,max_index=null;
		for(var i=0;i<cb.length;i++){
			var check=getCheckNum(cb,loosen,i);
			//采取Bland规则 直接取下标最小的正检验数
			if(check>max){
				max=check;
				max_index=i;
				break;
			}
		}
		//若存在为正的检验数 则寻找最小的比值数
		if(typeof max_index=='number'){
			var min=Infinity,min_index=null,min_index2=null;
			for(var i=0;i<loosen.length;i++){
				var bizhi=getBizhiNum(cb,loosen,i,max_index);
				//若两个最小的比值数同时存在 则采取Bland规则 选择下标最小的一项
				if(typeof bizhi=='number'&&
					(bizhi<min||bizhi==min&&loosen[i][2]<min_index2)){
					min=bizhi;
					min_index=i;
					min_index2=loosen[i][2];
				}
			}
			if(typeof min_index=='number'){
				//换入决策变量和价值系数
				loosen[min_index][2]=max_index;
				loosen[min_index][3]=cb[max_index][0];
				//调用updateMartix函数 对矩阵进行初等变换
				updateMartix(loosen,min_index,max_index);
			}
		}
		//若已经不存在正的检验数 则直接跳出循环检索
		else break;
	}
	//使用一维数组表示最优结果
	var result=[];
	//将该数组进行初始化
	for(var i=0;i<cb.length;i++) result.push(0);
	//将b列的值读取入该数组
	for(var i of loosen){
		result[i[2]]=i[1];
	}
	//返回该数组
	return result;
};
//进行初等行变换
function updateMartix(loosen,index1,index2){
	var list=loosen[index1],num=list[0][index2];
	//对中心点所在行进行除法运算 将该中心点的值变为1
	for(var i=0;i<list[0].length;i++){
		list[0][i]/=num;
	}
	list[1]/=num;
	//通过加法和乘法运算 将中心点所在列的值变为0
	for(var i=0;i<loosen.length;i++){
		if(i==index1) continue;
		var num2=loosen[i][0][index2];
		for(var j=0;j<loosen[i][0].length;j++){
			loosen[i][0][j]-=(loosen[index1][0][j]*num2);
		}
		loosen[i][1]-=loosen[index1][1]*num2;
	}
};
//使用比值判别法 获取比值数θ
function getBizhiNum(cb,loosen,index,maxIndex){
	var num=loosen[index][0][maxIndex];
	//若系数为负 则该行不可能被换出 返回null
	if(num<=0) return null;
	return loosen[index][1]/num;
};
//获取检验数σ
function getCheckNum(cb,loosen,index){
	var num=cb[index][0];
	for(var i=0;i<loosen.length;i++){
	num-=(loosen[i][3]*loosen[i][0][index]);
	}
	return num;
};
//插入松弛变量，决策变量和价值系数
function getLoosen(limit,goal){
	var loosen=limit.slice(0);
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
	return loosen;
};
function getWarBest(cost){
	var m = data[0].value.length; // 12
	var n = data.length; // 24
	var A = new Array(m);
	

	for(var i=0;i<m;i++){
		A[i] = new Array();
	    for(var j=0;j<n;j++){
	        A[i][j] = data[j].value[i];
	    }
	}
	// var b = new Array(m).fill(1);
    b = cost;
	var c = new Array(n);
	for(var i=0;i<n;i++){
	    c[i] = data[i].score;
	}
	var r = solveLP(A,b,c);
    return r;
	var sum = 0;
	for(var i=0;i<24;i++){
		sum += r[i]*data[i].score;
	}
	return sum;
}
function solveLP(A,b,c){
	var t=new Array();
	for(var i=0;i<A.length;i++){
		t[i] = [A[i],b[i]];
	}
    return getResult(c,t)
}