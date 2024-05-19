var b = 5;
//全局变量
var M = Infinity;
//var knrnel[110][310];
//声明二维数组    核心矩阵表
var m = 3,n = 3,t = -1;
//m:约束不等式个数  
//n:结构向量的个数   
//t:目标函数类型：－1代表求求最小值，1代表求最大值   
var f = 0;//最优值
var temp3 = new Array();
var temp4 = new Array();
var temp5 = new Array();
    
//约束条件矩阵
var x0=[];//多余部分
//      0 1 2 3 4 5 n < b
var x1=[, 1,1,0,0,0,1,1,10];
var x2=[, 1,0,1,0,0,1,1,10];
var x3=[, 0,1,1,0,0,1,1,10];
var x4=[, 0,0,0,1,0,1,1,10];
var x5=[, 0,0,0,0,1,1,1,15];
// 分数
var xc=[, 1,2,1,1,1,1];
//      0  1  2  3  4  m  1  2
var x= [x0,x1,x2,x3,x4,x5,x0,xc];
/* knrnel矩阵
1             +n         +m        +m
0            <-xc->
xb            xA          E         0
*/


var knrnel;

input();
// init();
comput();
show();

function init(){
    m = 12,n = 15;
    knrnel = new Array();
    for(var i = 0; i <= m+2; i++){
        knrnel[i] = new Array(n+2*m+1).fill(0);
    }
    for(var i = 0; i < n+m+m; i++){
        temp3[i] = 0;
        temp4[i] = 0;
        temp5[i] = 0;
    }
    for(var i = 1; i <= m; i++){
        knrnel[i][0] = 1000;
    }
    for(var j = 0; j < n; j++){
        knrnel[0][j + 1] = -data[j].score;
    }
    for(var i = 0; i < m; i++){
        for(var j = 0; j < n; j++){
            knrnel[i + 1][j + 1] = data[j].value[i];
        }
    }
    for(var i = 1; i <= m; i++){
		knrnel[i][n + i] = 1;
	}
}
function input(){
    knrnel = new Array();
    for(var i = 0; i <= m+20; i++){
        knrnel[i] = new Array(n+2*m+5).fill(0);
    }
    for(var i = 0; i <= n+m+m+20; i++){
        temp3[i] = 0;
        temp4[i] = 0;
        temp5[i] = 0;
    }
    t = -1;
    var i,j,f,k;
    for(var f = 1; f < m+1; f++){
        for(var k = 1; k < n+3; k++){
            knrnel[f][k]=x[f][k];
        }
    }
    
    for(var i = 1; i <= m; i++){
		knrnel[i][0] = knrnel[i][n + 2];
		knrnel[i][n + 2] = 0;
    }
    //读入目标条件 系数
    for(var j = 1; j <= n; j++){
        knrnel[0][j] = x[7][j]; 
    }
    //矩阵调整
    if(t == -1){
        for(var i = 1; i <= n; i++){
            knrnel[0][i] = (-1)*knrnel[0][i];
        }
    }
    //不等号方向(1/-1)
    for(i = 1; i <= m; i++){
		knrnel[i][n + i] = knrnel[i][n + 1];
		if(i != 1){
            knrnel[i][n + 1] = 0;
        }
	}
}
function show(){
    var r = document.getElementById("Ans");
    var z = document.getElementById("Matrix")
    var bestQ = 0
    for(var i = 1; i <= n; i++){
        bestQ += t * knrnel[0][i] * temp5[i];
    }
    r.appendChild(getSpan(bestQ.toFixed(1)));
    r.appendChild(document.createElement("br"));
    for(var i = 0; i <= n; i++){
        r.appendChild(getSpan((temp5[i]).toFixed(1)));
    }
    for(var i = 0; i <= m; i++){
        for(var j = 0; j <= n; j++){  
            z.appendChild(getSpan(knrnel[i][j].toFixed(1)));
        }
        z.appendChild(document.createElement("br"));
    }
}
function getSpan(Text){
    var span = document.createElement("span");
    span.innerHTML = Text;
    return span;
}
function comput(){
    // var gg = 0;
    var tiaochu = 0;
    var i,j,flag,temp1,temp2,h,k=0;

    var a,temp,aa,d,c;
    var b=new Array();
	for(i = 1; i <= m; i++){
		if(knrnel[i][n + i] == -1){
			knrnel[i][n + m + i] = 1;
			knrnel[0][n + m + i] = M;
			temp3[i] = n + m + i;
		}
		else
			temp3[i] = n + i;
	}
	for(i = 1; i <= m; i++)
		temp4[i] = knrnel[0][temp3[i]];
    do {
		for(i = 1; i <= n + m + m; i++){
			a = 0;
			for(j = 1; j <= m; j++)
                a = a + knrnel[j][i] * temp4[j];
                knrnel[m + 1][i] = knrnel[0][i] - a;
		}
		for(i = 1; i <= n + m + m; i++){
			if(knrnel[m + 1][i] >= 0) 
                flag = 1;
			else {
				flag = -1;
				break;
			}
		}
		if(flag == 1){
			for(i = 1; i <= m; i++){
				if(temp3[i] <= n + m) temp1 = 1;
				else {
					temp1 = -1;
					break;
				}
			}
			if(temp1 == 1){
				for(i = 1; i <= m; i++)
					temp5[temp3[i]] = knrnel[i][0];
                tiaochu=1;
				if(tiaochu==1){
                    break;
                }
            }
			else {
				tiaochu=1;
				if(tiaochu==1){
                    break;
                }
			}
        }
        if(tiaochu == 1){
            break;
        }
		if(flag == -1){
			temp = Infinity;
			for(i = 1; i <= n + m + m; i++)
				if(knrnel[m + 1][i] < temp){
					temp = knrnel[m + 1][i]; //min
					h = i; //min-id
				}
 
			for(i = 1; i <= m; i++){
				if(knrnel[i][h] <= 0) temp2 = 1;
				else {
					temp2 = -1;
					break;
				}
			}
		}
		if(temp2 == 1){
            if(tiaochu==1){
                break;
            }
        }
        if(tiaochu==1){
            break;
        }
		if(temp2 == -1){
			c = Infinity;
			for(i = 1; i <= m; i++){
				if(knrnel[i][h] != 0)  b[i] = knrnel[i][0] / knrnel[i][h];
				if(knrnel[i][h] == 0)  b[i] = Infinity;
				if(b[i] < 0)
                    b[i] = Infinity;
				if(b[i] < c){
					c = b[i];// min
					k = i;// min-id
				}
			}
			temp3[k] = h;
			temp4[k] = knrnel[0][h];
			d = knrnel[k][h];
			for(i = 0; i <= n + m + m; i++)
            knrnel[k][i] = knrnel[k][i] / d;
			for(i = 1; i <= m; i++){
				if(i == k){
                    continue;
                }
				aa = knrnel[i][h];
				for(j = 0; j <= n + m + m; j++)
                knrnel[i][j] = knrnel[i][j] - aa * knrnel[k][j];
			}
        }
        if(tiaochu==1){
            break;
        }
	} while (1);
}