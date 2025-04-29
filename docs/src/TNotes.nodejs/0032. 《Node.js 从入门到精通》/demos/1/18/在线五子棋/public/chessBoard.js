
let chess = document.getElementById("chess");
let layer = document.getElementById("layer");
let context = chess.getContext("2d");
let context2 = layer.getContext("2d");
// let first = document.querySelectorAll('.first')
// let currentPlayer = document.querySelector('#currentPlayer')
let winner = document.querySelector('#winner')
let cancelOne = document.querySelector('#cancelOne')
let colorSelect = document.querySelector('#colorSelect')
let user = document.querySelector('#user')
let room = document.querySelector('#room')
let enter = document.querySelector('#enter')
let userInfo = document.querySelector('.userInfo')
let waitingUser = document.querySelector('.waitingUser')

let socket = io.connect('http://127.0.0.1:3000')

let userList = []

enter.addEventListener('click', (event) => {
	if( !user.value || !room.value ){
      alert('请输入用户名或者房间号...')
      return;
  }
  let ajax = new XMLHttpRequest()
  ajax.open('get', 'http://127.0.0.1:3000?room=' + room.value + '&user=' + user.value)
  ajax.send()
  ajax.onreadystatechange = function () {
  	if (ajax.readyState === 4 && ajax.status === 200) {
  		//用户请求进入房间
  		socket.emit('enter', {
				userName: user.value,
				roomNo: room.value
			})
			//canDown:true用户执黑棋, canDown:false用户执白棋
			socket.on('userInfo', (data) => {
				obj.me = data.canDown
			})
			//显示房间用户信息
			socket.on('roomInfo', (data) => {
				if (data.roomNo === room.value) {
					userInfo.innerHTML = ''
					for (let user in data.roomInfo) {
						if (user !== 'full') {
							userList.push(user)
							let div = document.createElement('div')
							let userName = document.createTextNode(user)
							div.appendChild(userName)
							div.setAttribute('class', 'userItem')
							userInfo.appendChild(div)
							if (data.roomInfo[user].canDown) {
								div.style.backgroundColor = 'black'
								div.style.color = 'white'
								
								waitingUser.innerHTML = `等待${user}落子...`
							} else {
								div.style.backgroundColor = 'white'
								waitingUser.innerHTML = `等待其他用户加入...`
							}
						}
					}
				}
			})
			//下棋
			layer.onclick = function (e) {
		    let x = e.offsetX ;
		    let y = e.offsetY ;
		    let j = Math.floor(x/30) ;
		    let i = Math.floor(y/30) ;
		    if (chessBoard[i][j] === 0) {
		      socket.emit('move', {
		      	i:i,
		      	j:j,
		      	isBlack: obj.me,
		      	userName: user.value,
		      	roomNo: room.value
		      })
		    }
			}
			//显示棋子
			socket.on('moveInfo', (data) => {
				if (data.roomNo === room.value) {
					let {i, j, isBlack} = data
					oneStep(i, j, isBlack,false)
					if (data.isBlack) {
					  chessBoard[i][j] = 1;
					} else {
					  chessBoard[i][j] = 2;
					}
					if (checkWin(i,j,obj.me)) {
		      	socket.emit('userWin', {
		      		userName: data.userName,
		      		roomNo: data.roomNo
		      	})
		      }
		      userList.forEach((item, index, array) => {
		      	if (item !== data.userName) {
		      		waitingUser.innerHTML = `等待${item}落子...`
		      	}
		      })
				}
			})
			//提示胜利者，禁止再下棋
			socket.on('userWinInfo', (data) => {
				if (data.roomNo === room.value) {
					alert(`${data.userName}胜利！`)
					waitingUser.innerHTML = `${data.userName}胜利！`
					waitingUser.style.color = 'red'
					for (let i = 0; i < 15; i++) {
						for (let j = 0; j < 15; j++) {
							chessBoard[i][j] = 3
						}
					}
					reStart()
					waitingUser.style.color = 'black'
				}
			})
			//提示用户房间已满
			socket.on('roomFull', (data) => {
				alert(`房间${data}已满，请更换房间！`)
				room.value = ''
			})
			//提示用户重名
			socket.on('userExisted', (data) => {
				alert(`用户${data}已存在，请更换用户名！`)
			})

			socket.on('userEscape', ({userName, roomNo}) => {
				if (roomNo === room.value) {
					alert(`${userName}逃跑了，请等待其他用户加入！`)
					reStart()
				}
			})
  	}
  }
})

function checkLeave(){
	socket.emit('userDisconnect', {
		userName: user.value,
		roomNo: room.value
	})
}

	//改变棋盘颜色
	colorSelect.addEventListener('change', (event) => {
		// console.log(event.target.value)
		context.fillStyle = event.target.value;
		context.fillRect(0, 0, 450, 450,);
		drawLine();
	})
	//监控当前执棋
	let obj = {}
	obj.me = true;

	//画棋盘
	function drawLine () {
	  for (let i = 0; i < 15; i++) {
		  context.moveTo(15, 15 + i * 30);
		  context.lineTo(435, 15 + i * 30);
		  context.stroke();
		  context.moveTo(15 + i * 30, 15);
		  context.lineTo(15 + i * 30, 435);
		  context.stroke();
	  }
	}
	context.fillStyle = '#DEB887';
	context.fillRect(0, 0, 450, 450,);
	drawLine();

	//初始化棋盘各个点
	var chessBoard = [];
	for (let i = 0; i < 15; i++) {
	  chessBoard[i] = [];
	  for (let j = 0; j < 15; j++) {
	    chessBoard[i][j] = 0;
	  }
	}

	//鼠标移动时棋子提示
	let old_i = 0;
	let old_j = 0;

	layer.onmousemove = function (e) {
	  if (chessBoard[old_i][old_j] === 0) {
	    context2.clearRect(15+old_j*30-13, 15+old_i*30-13, 26, 26)
	  }
	  var x = e.offsetX ;
	  var y = e.offsetY ;
	  var j = Math.floor(x/30) ;
	  var i = Math.floor(y/30) ;
	  if (chessBoard[i][j] === 0) {
	      oneStep(i, j, obj.me, true)
	      old_i = i;
	  		old_j = j;
	  }
	}

	layer.onmouseleave = function (e) {
	  if (chessBoard[old_i][old_j] === 0) {
	    context2.clearRect(15+old_j*30-13, 15+old_i*30-13, 26, 26)
	  }
	}

	//绘制棋子
	function oneStep (j, i, me, isHover) {//i,j分别是在棋盘中的定位，me代表白棋还是黑棋
    context2.beginPath();
    context2.arc(15+i*30, 15+j*30, 13, 0, 2*Math.PI);//圆心会变的，半径改为13
    context2.closePath();
    var gradient = context2.createRadialGradient(15+i*30+2, 15+j*30-2, 15, 15+i*30, 15+j*30, 0);
	  if (!isHover) {
	     if(me){
	        gradient.addColorStop(0, "#0a0a0a");
	        gradient.addColorStop(1, "#636766");
	    }else{
	        gradient.addColorStop(0, "#D1D1D1");
	        gradient.addColorStop(1, "#F9F9F9");
	    }
	  } else {
	    if(me){
	        gradient.addColorStop(0, "rgba(10, 10, 10, 0.8)");
	        gradient.addColorStop(1, "rgba(99, 103, 102, 0.8)");
	    }else{
	        gradient.addColorStop(0, "rgba(209, 209, 209, 0.8)");
	        gradient.addColorStop(1, "rgba(249, 249, 249, 0.8)");
	    }
	  }
	    context2.fillStyle = gradient ;
	    context2.fill();
	}

	//检查各个方向是否符合获胜条件
	function checkDirection (i,j,p,q) {
		//p=0,q=1 水平方向；p=1,q=0 竖直方向
		//p=1,q=-1 左下到右上
		//p=-1,q=1 左到右上
		let m = 1
		let n = 1
		let isBlack = obj.me ? 1 : 2

		for (; m < 5; m++) {
			// console.log(`m:${m}`)
			if (!(i+m*p >= 0 && i+m*p <=14 && j+m*q >=0 && j+m*q <=14)) {
				break;
			} else {
				if (chessBoard[i+m*(p)][j+m*(q)] !== isBlack) {
				 break;
				}
			}
		}
		for (; n < 5; n++) {
			// console.log(`n:${n}`)
			if(!(i-n*p >=0 && i-n*p <=14 && j-n*q >=0 && j-n*q <=14)) {
				break;
			} else {
				if (chessBoard[i-n*(p)][j-n*(q)] !== isBlack) {
				 break;
				}
			}
		}
		if (n+m+1 >= 7) {
			return true
		}
		return false
	}

	//检查是否获胜
	function checkWin (i,j) {
		// console.table(chessBoard)
		if (checkDirection(i,j,1,0) || checkDirection(i,j,0,1) ||
		   checkDirection(i,j,1,-1) || checkDirection(i,j,1,1)) {
			return true
		}
		return false
	}

	//重新开始
	function reStart () {
	  context2.clearRect(0, 0, 450, 450)
	  waitingUser.innerHTML = '请上局失利者先落子！'
		for (let i = 0; i < 15; i++) {
		  chessBoard[i] = [];
		  for (let j = 0; j < 15; j++) {
		    chessBoard[i][j] = 0;
		  }
		}
		if (userList.length === 2) {
			if (userList[1] === user.value) {
				obj.me = true
			} else {
				obj.me = false
			}
		}
		
		old_i = 0;
		old_j = 0;
	}
