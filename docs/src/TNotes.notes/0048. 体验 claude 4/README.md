# [0048. 体验 claude 4](https://github.com/Tdahuyou/TNotes.notes/tree/main/notes/0048.%20%E4%BD%93%E9%AA%8C%20claude%204)

<!-- region:toc -->

- [📺 bilibili 👉 TNotes 合集](https://space.bilibili.com/407241004)
  - [bilibili.TNotes.notes.0048.1](https://www.bilibili.com/video/BV1XwjozKEcb)
- [1. 📝 概述](#1--概述)
- [2. 🤖 AI - 请给我一个连连看的 Web 程序](#2--ai---请给我一个连连看的-web-程序)

<!-- endregion:toc -->

## 1. 📝 概述

<B id="BV1XwjozKEcb" />

- 刚看到一个讲 Claude 4 的视频，顺带着去体验了一下 Claude 4 的编程效果，让它做一个“连连看”小游戏，虽然有 bug，不过效果确实已经很不错了。
- 听 UP 主介绍，在 cursor 中已经集成了 claude 4。
- 现在 `25.05` 使用的 IDE 依旧是 vscode。

## 2. 🤖 AI - 请给我一个连连看的 Web 程序

- 最终效果预览：
- ![图 0](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-05-28-20-31-16.png)

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>连连看游戏</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        margin: 0;
        padding: 20px;
        min-height: 100vh;
        color: white;
      }

      .game-header {
        display: flex;
        gap: 30px;
        margin-bottom: 20px;
        font-size: 18px;
        font-weight: bold;
      }

      .score,
      .time,
      .level {
        background: rgba(255, 255, 255, 0.2);
        padding: 10px 20px;
        border-radius: 10px;
        backdrop-filter: blur(10px);
      }

      .game-board {
        display: grid;
        grid-template-columns: repeat(8, 60px);
        grid-template-rows: repeat(6, 60px);
        gap: 2px;
        background: rgba(255, 255, 255, 0.1);
        padding: 20px;
        border-radius: 15px;
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }

      .tile {
        width: 60px;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.2s ease;
        background: linear-gradient(145deg, #ffffff, #e6e6e6);
        color: #333;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        user-select: none;
      }

      .tile:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .tile.selected {
        background: linear-gradient(145deg, #ffd700, #ffed4e);
        transform: scale(1.05);
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
      }

      .tile.matched {
        background: linear-gradient(145deg, #90ee90, #98fb98);
        animation: matchPulse 0.5s ease;
      }

      .tile.empty {
        background: transparent;
        cursor: default;
        box-shadow: none;
      }

      .tile.empty:hover {
        transform: none;
      }

      @keyframes matchPulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.2);
        }
        100% {
          transform: scale(1);
        }
      }

      .controls {
        margin-top: 20px;
        display: flex;
        gap: 15px;
      }

      button {
        padding: 12px 24px;
        font-size: 16px;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        background: linear-gradient(145deg, #ff6b6b, #ee5a24);
        color: white;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      }

      button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
      }

      button:active {
        transform: translateY(0);
      }

      .restart-btn {
        background: linear-gradient(145deg, #4ecdc4, #44a08d) !important;
      }

      .hint-btn {
        background: linear-gradient(145deg, #a8edea, #fed6e3) !important;
        color: #333 !important;
      }

      .game-over {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        display: none;
        backdrop-filter: blur(10px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      }

      .game-over h2 {
        margin-top: 0;
        font-size: 32px;
        background: linear-gradient(145deg, #ffd700, #ffed4e);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .connection-line {
        position: absolute;
        background: #ffd700;
        height: 3px;
        border-radius: 2px;
        z-index: 10;
        box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
        animation: lineGlow 0.5s ease;
      }

      @keyframes lineGlow {
        0% {
          opacity: 0;
          transform: scale(0.8);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
    </style>
  </head>
  <body>
    <h1>🎮 连连看游戏</h1>

    <div class="game-header">
      <div class="score">得分: <span id="score">0</span></div>
      <div class="time">时间: <span id="time">0</span>s</div>
      <div class="level">关卡: <span id="level">1</span></div>
    </div>

    <div class="game-board" id="gameBoard"></div>

    <div class="controls">
      <button class="restart-btn" onclick="startNewGame()">重新开始</button>
      <button class="hint-btn" onclick="showHint()">提示</button>
    </div>

    <div class="game-over" id="gameOver">
      <h2>🎉 恭喜过关！</h2>
      <p>你的得分: <span id="finalScore"></span></p>
      <p>用时: <span id="finalTime"></span> 秒</p>
      <button onclick="nextLevel()">下一关</button>
      <button class="restart-btn" onclick="startNewGame()">重新开始</button>
    </div>

    <script>
      const BOARD_WIDTH = 8
      const BOARD_HEIGHT = 6
      const SYMBOLS = [
        '🐶',
        '🐱',
        '🐭',
        '🐹',
        '🐰',
        '🦊',
        '🐻',
        '🐼',
        '🐨',
        '🐯',
        '🦁',
        '🐮',
        '🐷',
        '🐸',
        '🐙',
        '🐠',
      ]

      let board = []
      let selectedTiles = []
      let score = 0
      let timeElapsed = 0
      let currentLevel = 1
      let timer
      let gameActive = true

      function initializeBoard() {
        board = Array(BOARD_HEIGHT)
          .fill()
          .map(() => Array(BOARD_WIDTH).fill(null))

        // 生成成对的符号
        const pairs = []
        const totalPairs = (BOARD_WIDTH * BOARD_HEIGHT) / 2

        for (let i = 0; i < totalPairs; i++) {
          const symbol = SYMBOLS[i % SYMBOLS.length]
          pairs.push(symbol, symbol)
        }

        // 随机打乱
        for (let i = pairs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[pairs[i], pairs[j]] = [pairs[j], pairs[i]]
        }

        // 填充到棋盘
        let pairIndex = 0
        for (let row = 0; row < BOARD_HEIGHT; row++) {
          for (let col = 0; col < BOARD_WIDTH; col++) {
            board[row][col] = pairs[pairIndex++]
          }
        }
      }

      function renderBoard() {
        const gameBoard = document.getElementById('gameBoard')
        gameBoard.innerHTML = ''

        for (let row = 0; row < BOARD_HEIGHT; row++) {
          for (let col = 0; col < BOARD_WIDTH; col++) {
            const tile = document.createElement('div')
            tile.className = 'tile'
            tile.dataset.row = row
            tile.dataset.col = col

            if (board[row][col]) {
              tile.textContent = board[row][col]
              tile.addEventListener('click', () => handleTileClick(row, col))
            } else {
              tile.classList.add('empty')
            }

            gameBoard.appendChild(tile)
          }
        }
      }

      function handleTileClick(row, col) {
        if (!gameActive || !board[row][col]) return

        const tile = getTileElement(row, col)

        if (selectedTiles.some((t) => t.row === row && t.col === col)) {
          // 取消选择
          selectedTiles = selectedTiles.filter(
            (t) => !(t.row === row && t.col === col)
          )
          tile.classList.remove('selected')
          clearConnectionLines()
          return
        }

        if (selectedTiles.length >= 2) {
          clearSelection()
        }

        selectedTiles.push({ row, col, symbol: board[row][col] })
        tile.classList.add('selected')

        if (selectedTiles.length === 2) {
          setTimeout(() => checkMatch(), 300)
        }
      }

      function checkMatch() {
        if (selectedTiles.length !== 2) return

        const [tile1, tile2] = selectedTiles

        if (tile1.symbol === tile2.symbol && canConnect(tile1, tile2)) {
          // 匹配成功
          matchTiles(tile1, tile2)
          score += 10 * currentLevel
          updateScore()

          if (isGameComplete()) {
            gameActive = false
            setTimeout(showGameOver, 500)
          }
        }

        clearSelection()
      }

      function canConnect(tile1, tile2) {
        // 简化连接逻辑：直线连接或一个转角
        return (
          canConnectStraight(tile1, tile2) ||
          canConnectWithOneCorner(tile1, tile2)
        )
      }

      function canConnectStraight(tile1, tile2) {
        // 水平直线
        if (tile1.row === tile2.row) {
          const minCol = Math.min(tile1.col, tile2.col)
          const maxCol = Math.max(tile1.col, tile2.col)
          for (let col = minCol + 1; col < maxCol; col++) {
            if (board[tile1.row][col]) return false
          }
          drawConnectionLine(tile1, tile2)
          return true
        }

        // 垂直直线
        if (tile1.col === tile2.col) {
          const minRow = Math.min(tile1.row, tile2.row)
          const maxRow = Math.max(tile1.row, tile2.row)
          for (let row = minRow + 1; row < maxRow; row++) {
            if (board[row][tile1.col]) return false
          }
          drawConnectionLine(tile1, tile2)
          return true
        }

        return false
      }

      function canConnectWithOneCorner(tile1, tile2) {
        // 尝试通过一个转角连接
        const corner1 = { row: tile1.row, col: tile2.col }
        const corner2 = { row: tile2.row, col: tile1.col }

        // 检查转角1
        if (
          !board[corner1.row][corner1.col] &&
          canConnectStraight(tile1, corner1) &&
          canConnectStraight(corner1, tile2)
        ) {
          drawConnectionLineWithCorner(tile1, tile2, corner1)
          return true
        }

        // 检查转角2
        if (
          !board[corner2.row][corner2.col] &&
          canConnectStraight(tile1, corner2) &&
          canConnectStraight(corner2, tile2)
        ) {
          drawConnectionLineWithCorner(tile1, tile2, corner2)
          return true
        }

        return false
      }

      function drawConnectionLine(tile1, tile2) {
        const pos1 = getTilePosition(tile1.row, tile1.col)
        const pos2 = getTilePosition(tile2.row, tile2.col)

        const line = document.createElement('div')
        line.className = 'connection-line'

        const dx = pos2.x - pos1.x
        const dy = pos2.y - pos1.y
        const length = Math.sqrt(dx * dx + dy * dy)
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI

        line.style.width = length + 'px'
        line.style.left = pos1.x + 30 + 'px'
        line.style.top = pos1.y + 30 + 'px'
        line.style.transform = `rotate(${angle}deg)`
        line.style.transformOrigin = '0 50%'

        document.body.appendChild(line)

        setTimeout(() => line.remove(), 500)
      }

      function drawConnectionLineWithCorner(tile1, tile2, corner) {
        // 简化处理，绘制两条线段
        drawConnectionLine(tile1, corner)
        drawConnectionLine(corner, tile2)
      }

      function getTilePosition(row, col) {
        const gameBoard = document.getElementById('gameBoard')
        const rect = gameBoard.getBoundingClientRect()
        return {
          x: rect.left + col * 62 + 20,
          y: rect.top + row * 62 + 20,
        }
      }

      function matchTiles(tile1, tile2) {
        board[tile1.row][tile1.col] = null
        board[tile2.row][tile2.col] = null

        const element1 = getTileElement(tile1.row, tile1.col)
        const element2 = getTileElement(tile2.row, tile2.col)

        element1.classList.add('matched')
        element2.classList.add('matched')

        setTimeout(() => {
          element1.classList.add('empty')
          element1.textContent = ''
          element1.removeEventListener('click', handleTileClick)

          element2.classList.add('empty')
          element2.textContent = ''
          element2.removeEventListener('click', handleTileClick)
        }, 200)
      }

      function clearSelection() {
        selectedTiles.forEach((tile) => {
          const element = getTileElement(tile.row, tile.col)
          element.classList.remove('selected')
        })
        selectedTiles = []
        clearConnectionLines()
      }

      function clearConnectionLines() {
        document
          .querySelectorAll('.connection-line')
          .forEach((line) => line.remove())
      }

      function getTileElement(row, col) {
        return document.querySelector(`[data-row="${row}"][data-col="${col}"]`)
      }

      function isGameComplete() {
        return board.every((row) => row.every((cell) => cell === null))
      }

      function showGameOver() {
        clearInterval(timer)
        document.getElementById('finalScore').textContent = score
        document.getElementById('finalTime').textContent = timeElapsed
        document.getElementById('gameOver').style.display = 'block'
      }

      function nextLevel() {
        currentLevel++
        document.getElementById('level').textContent = currentLevel
        document.getElementById('gameOver').style.display = 'none'
        startNewGame()
      }

      function startNewGame() {
        clearInterval(timer)
        score = 0
        timeElapsed = 0
        gameActive = true
        selectedTiles = []

        updateScore()
        updateTime()

        initializeBoard()
        renderBoard()

        timer = setInterval(() => {
          timeElapsed++
          updateTime()
        }, 1000)

        document.getElementById('gameOver').style.display = 'none'
      }

      function showHint() {
        // 寻找可以连接的一对
        for (let row1 = 0; row1 < BOARD_HEIGHT; row1++) {
          for (let col1 = 0; col1 < BOARD_WIDTH; col1++) {
            if (!board[row1][col1]) continue

            for (let row2 = 0; row2 < BOARD_HEIGHT; row2++) {
              for (let col2 = 0; col2 < BOARD_WIDTH; col2++) {
                if (!board[row2][col2] || (row1 === row2 && col1 === col2))
                  continue

                if (
                  board[row1][col1] === board[row2][col2] &&
                  canConnect({ row: row1, col: col1 }, { row: row2, col: col2 })
                ) {
                  const element1 = getTileElement(row1, col1)
                  const element2 = getTileElement(row2, col2)

                  element1.style.background =
                    'linear-gradient(145deg, #ff9ff3, #f368e0)'
                  element2.style.background =
                    'linear-gradient(145deg, #ff9ff3, #f368e0)'

                  setTimeout(() => {
                    element1.style.background = ''
                    element2.style.background = ''
                  }, 2000)

                  return
                }
              }
            }
          }
        }
      }

      function updateScore() {
        document.getElementById('score').textContent = score
      }

      function updateTime() {
        document.getElementById('time').textContent = timeElapsed
      }

      // 启动游戏
      startNewGame()
    </script>
  </body>
</html>
```
