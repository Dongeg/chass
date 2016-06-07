window.onload=function(){
	var canvas=document.getElementById("canvas");
	var context=canvas.getContext("2d");	
	var main=document.getElementById("main");
	canvas.width=main.clientWidth;
	canvas.height=main.clientWidth;
	var w=canvas.width;
	var perW=w/15;
	var borderW=w/30;
	var black=true;//判断落黑白子默认黑子先行
	var img=new Image();
	//存放某点是否落子信息
	var over=false;//是否结束
	var chassBoard=[];
	var wins=[];
	var popWin=[];
	var comWin=[];
	for(var i=0;i<15;i++){
		chassBoard[i]=[];
		for(var j=0;j<15;j++){
			chassBoard[i][j]=0;
		}
	}
	//赢法数组
	var wins=[];
	for(var i=0;i<15;i++){
		wins[i]=[];
		for(var j=0;j<15;j++){
			wins[i][j]=[];
		}
	}
	//赢法种类
	//所有横向五子连珠
	var count=0;
	for(var i=0;i<15;i++){
		for(var j=0;j<11;j++){
			for(var k=0;k<5;k++){
				wins[i][j+k][count]=true;
			}
			count++;
		}
	}
	//所有纵向五子连珠
	for(var i=0;i<15;i++){
		for(var j=0;j<11;j++){
			for(var k=0;k<5;k++){
				wins[j+k][i][count]=true;
			}
			count++;
		}
	}
	//左上到右下方向
	//[1][1][0]    //[1][2][1] 
	//[2][2][0]    //[2][3][1] 
	//[3][3][0]    //[3][4][1] 
	//[4][4][0]    //[4][5][1] 
	//[5][5][0]    //[5][6][1] 
	
	for(var i=0;i<11;i++){
		for(var j=0;j<11;j++){
			for(var k=0;k<5;k++){
				wins[i+k][j+k][count]=true;
			}
			count++;
		}
	}
	//右上到左下
	for(var i=0;i<11;i++){
		for(var j=14;j>3;j--){
			for(var k=0;k<5;k++){
				wins[i+k][j-k][count]=true;
			}
			count++;
		}
	}
	console.log(count);
	//赢法统计数组

	for(var i=0;i<count;i++){
		popWin[i]=0;
		comWin[i]=0;
	}
	
	img.src="img/1.jpg";
	img.onload=function(){
		context.drawImage(img,0,0,w,w);
		strokeline();
		
	}
	//画棋盘
	function strokeline(){
		context.strokeStyle="#bfbfbf";
		for(var i=0;i<15;i++){
			context.beginPath();
			context.moveTo(borderW+i*perW,borderW);
			context.lineTo(borderW+i*perW,w-borderW);
			context.stroke();
			context.beginPath();
			context.moveTo(borderW,borderW+i*perW);
			context.lineTo(w-borderW,borderW+i*perW);
			context.stroke();
		}
    }
	//画棋子
	function strokechassman(i,j,black){
		context.beginPath();
		context.arc(borderW+i*perW,borderW+j*perW,w/35,0,2*Math.PI);
		context.closePath();
		var gradient=context.createRadialGradient(borderW+i*perW,borderW+j*perW,w/35,borderW+i*perW+2,borderW+j*perW-2,0);
		if(black){
			gradient.addColorStop(0,"#0a0a0a");
			gradient.addColorStop(1,"#636766");
		}
		else{
			gradient.addColorStop(0,"#d1d1d1");
			gradient.addColorStop(1,"#f9f9f9");			
		}
		context.fillStyle=gradient;
		context.fill();
	}
	//落子
	canvas.onclick=function(e){
		if(over){
			return;
		}
		if(!black){
			return;
		}
		var x=e.offsetX;
		var y=e.offsetY;
		var i=Math.floor(x/perW);
		var j=Math.floor(y/perW);
		if(chassBoard[i][j]==0){
			strokechassman(i,j,black);
				chassBoard[i][j]=1;
			 for(var k=0;k<count;k++){
				if(wins[i][j][k]){
					popWin[k]++;
					comWin[k]=6;
					if(popWin[k]==5){
						$(function(){
						    $("#peoplewin").modal();						 
						});
						over=true;
					}
				}
			}
			if(!over){
				black=!black;
				computerAI();
			}
		}
	}
		var computerAI=function(){
		var peopleScore=[];
		var computerScore=[];
		var max=0;//保存最高分
		var u=0;
		var v=0;
		for(var i=0;i<15;i++){
			peopleScore[i]=[];
			computerScore[i]=[];
			for(var j=0;j<15;j++){
				peopleScore[i][j]=0;
				computerScore[i][j]=0;
			}
		}
		for(var i=0;i<15;i++){
			for(var j=0;j<15;j++){
				if(chassBoard[i][j]==0){
					for(var k=0;k<count;k++){
						if(wins[i][j][k]){
							//人
							if(popWin[k]==1){
								peopleScore[i][j]+=200;
							}
							else if(popWin[k]==2){
								peopleScore[i][j]+=400;
							}
							else if(popWin[k]==3){
								peopleScore[i][j]+=2000;
							}
							else if(popWin[k]==4){
								peopleScore[i][j]+=10000;
							}
							
							//计算机
							if(comWin[k]==1){
								computerScore[i][j]+=220;
							}
							else if(comWin[k]==2){
								computerScore[i][j]+=420;
							}
							else if(comWin[k]==3){
								computerScore[i][j]+=2200;
							}
							else if(comWin[k]==4){
								computerScore[i][j]+=20000;
							}
																					
						}
					}
					if(peopleScore[i][j]>max){
						max=peopleScore[i][j];
						u=i;
						v=j;
					}
					else if(peopleScore[i][j]==max){
						if(computerScore[i][j]>computerScore[u][v]){
							u=i;
							v=j;
						}
					}
					
					
					
					if(computerScore[i][j]>max){
						max=computerScore[i][j];
						u=i;
						v=j;
					}
					else if(computerScore[i][j]==max){
						if(peopleScore[i][j]>peopleScore[u][v]){
							u=i;
							v=j;
						}
					}
				}
			}
		}
		strokechassman(u,v,false);
		chassBoard[u][v]=2;
					 for(var k=0;k<count;k++){
				if(wins[u][v][k]){
					comWin[k]++;
					popWin[k]=-1;
					if(comWin[k]==5){
						$(function(){
						    $("#computerwin").modal();						 
						});
						over=true;
					}
				}
			}
			if(!over){
				black=!black;
			}
	}
}


