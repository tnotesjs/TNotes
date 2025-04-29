let express = require('express')
let http = require('http')
let app = express()
let path = require('path')
let server = http.createServer(app)
let io = require('socket.io').listen(server)

let port = process.env.PORT || 3000

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

app.use(express.static(path.join(__dirname, 'public')))

let connectRoom = {}

const changeAuth = (currentRoom, currentUser) => {
    for (let user in currentRoom) {
        if (user === currentUser) {
            currentRoom[user].canDown = false
        } else {
            currentRoom[user].canDown = true
        }
    }
}

io.on('connection', (socket) => {
    console.log('connected')
    socket.on('enter', (data) => {
        //第一个用户进入，新建房间
        if (connectRoom[data.roomNo] === undefined) {
            connectRoom[data.roomNo] = {}
            connectRoom[data.roomNo][data.userName] = {}
            connectRoom[data.roomNo][data.userName].canDown = false
            connectRoom[data.roomNo].full = false
            console.log(connectRoom)
            socket.emit('userInfo', {
                canDown: false
                // roomInfo:connectRoom[data.roomNo]
            })
            socket.emit('roomInfo', {
                roomNo: data.roomNo,
                roomInfo: connectRoom[data.roomNo]
            })
            socket.broadcast.emit('roomInfo', {
                roomNo: data.roomNo,
                roomInfo: connectRoom[data.roomNo]
            })
        } //第二个用户进入且不重名
        else if (!connectRoom[data.roomNo].full &&
            connectRoom[data.roomNo][data.userName] === undefined) {
            connectRoom[data.roomNo][data.userName] = {}
            connectRoom[data.roomNo][data.userName].canDown = true
            connectRoom[data.roomNo].full = true
            console.log(connectRoom)
            socket.emit('userInfo', {
                canDown: true
            })
            socket.emit('roomInfo', {
                roomNo: data.roomNo,
                roomInfo: connectRoom[data.roomNo]
            })
            socket.broadcast.emit('roomInfo', {
                roomNo: data.roomNo,
                roomInfo: connectRoom[data.roomNo]
            })
        } //第二个用户进入但重名
        else if (!connectRoom[data.roomNo].full &&
            connectRoom[data.roomNo][data.userName]) {
            socket.emit('userExisted', data.userName)
        } //房间已满
        else if (connectRoom[data.roomNo].full) {
            socket.emit('roomFull', data.roomNo)
        }
    })

    socket.on('move', (data) => {
        let room = data.roomNo
        let user = data.userName
        if (connectRoom[room]["full"] && connectRoom[room][user].canDown) {
            socket.broadcast.emit('moveInfo', {
                i: data.i,
                j: data.j,
                isBlack: data.isBlack,
                userName: user,
                roomNo: room
            })
            socket.emit('moveInfo', {
                i: data.i,
                j: data.j,
                isBlack: data.isBlack,
                userName: user,
                roomNo: room
            })
            changeAuth(connectRoom[room], user)
        }
    })

    socket.on('userWin', (data) => {
        changeAuth(connectRoom[data.roomNo], data.userName)
        socket.emit('userWinInfo', {
            userName: data.userName,
            roomNo: data.roomNo
        })
        socket.broadcast.emit('userWinInfo', {
            userName: data.userName,
            roomNo: data.roomNo
        })
    })

    socket.on('userDisconnect', ({userName, roomNo}) => {
        if (connectRoom[roomNo] && connectRoom[roomNo][userName]) {
            socket.broadcast.emit('userEscape', {userName, roomNo})
            delete connectRoom[roomNo][userName]
            connectRoom[roomNo].full = false
            let keys = Object.getOwnPropertyNames(connectRoom[roomNo]).length
            if (keys <= 1) {
                delete connectRoom[roomNo]
            } else {
                for (let user in connectRoom[roomNo]) {
                    if (user !== 'full') {
                        connectRoom[roomNo][user].canDown = false
                        socket.emit('userInfo', {
                            canDown: false
                        })
                        socket.emit('roomInfo', {
                            roomNo,
                            roomInfo: connectRoom[roomNo]
                        })
                        socket.broadcast.emit('roomInfo', {
                            roomNo,
                            roomInfo: connectRoom[roomNo]
                        })
                    }
                }
            }
            console.log(connectRoom)
        }
    })
})