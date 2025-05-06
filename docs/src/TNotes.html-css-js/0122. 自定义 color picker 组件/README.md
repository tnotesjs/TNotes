# [0122. 自定义 color picker 组件](https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0122.%20%E8%87%AA%E5%AE%9A%E4%B9%89%20color%20picker%20%E7%BB%84%E4%BB%B6)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 Spectrum](#2--spectrum)
- [3. 💻 demos.1](#3--demos1)

<!-- endregion:toc -->

## 1. 📝 概述

- 记录一个自定义的 color picker 组件的实现。

## 2. 📒 Spectrum

- js 颜色选择器 - Spectrum
- https://bgrins.github.io/spectrum/#why
- https://github.com/bgrins/spectrum

## 3. 💻 demos.1

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>3</title>
  </head>
  <body>
    <script>
      class ColorPicker extends HTMLElement {
        constructor() {
          super()

          this.controller = new AbortController()
          this.signal = this.controller.signal

          // 创建 Shadow DOM
          const shadow = this.attachShadow({ mode: 'open' })

          // 定义模板
          shadow.innerHTML = `
            <style>
              #color-picker {
                width: 200px;
                border: 1px solid #ccc;
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
              }
              #color-board {
                width: 200px;
                height: 100px;
              }
              /* 色板容器 */
              #board-container {
                position: relative;
                width: 100%;
                cursor: grab;
                height: 100px;
              }
              /* 色板控制点 */
              #board-point {
                position: absolute;
                top: 0;
                left: 0;
                width: 18px;
                height: 18px;
                box-sizing: border-box;
                transform: translate(-50%, -50%);
                border: 2px solid white;
                border-radius: 50%;
                box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
              }
              /* 颜色条容器 */
              #color-slider-container {
                cursor: grab;
                display: flex;
                align-items: center;
                margin: 0.5rem 0;
              }
              /* 当前颜色显示 */
              #current-color {
                width: 1.5rem;
                height: 1.5rem;
                border-radius: 50%;
                border: 1px solid #ccc;
                margin-right: 0.5rem;
              }
              /* 颜色条 */
              #color-slider-box {
                position: relative;
              }
              #color-slider {
                border-radius: 5px;
              }
              /* 滑块控制点 */
              #slider-thumb {
                position: absolute;
                top: 0;
                left: 0;
                box-sizing: border-box;
                width: 18px;
                height: 18px;
                transform: translate(-50%, 50%);
                margin-top: -6px;
                border: 2px solid white; /* 边框颜色为白色 */
                border-radius: 50%;
                box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
              }
              #preset-colors-container {
                width: 188px;
                margin: 0 auto;
                display: flex;
                flex-wrap: wrap;
                justify-content: start;
                gap: 5px;
              }
              .color-block {
                width: 1rem;
                height: 1rem;
                cursor: pointer;
                box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
              }
              #hex-input {
                padding: 5px;
                margin: 10px 0;
                outline: none;
                border: none;
                background-color: #f1f1f1;
              }
            </style>

            <div id="color-picker">
              <!-- 色板 -->
              <div id="board-container">
                <div id="color-board"></div>
                <div id="board-point"></div>
              </div>
              <!-- 颜色条 -->
              <div id="color-slider-container">
                <div id="current-color"></div>
                <div id="color-slider-box">
                  <canvas id="color-slider" width="150" height="7"></canvas>
                  <div id="slider-thumb"></div>
                </div>
              </div>
              <!-- 预设颜色块 -->
              <div id="preset-colors-container"></div>
              <!-- 十六进制输入框 -->
              <input type="text" id="hex-input" placeholder="#FFFFFF" />
            </div>
          `

          // 初始化颜色选择器逻辑
          this.init()
        }

        init() {
          const shadowRoot = this.shadowRoot
          const colorPicker = shadowRoot.getElementById('color-picker')
          const boardContainer = shadowRoot.getElementById('board-container')
          const colorSliderContainer = shadowRoot.getElementById(
            'color-slider-container'
          )
          const colorBoard = shadowRoot.getElementById('color-board')
          const colorSlider = shadowRoot.getElementById('color-slider')
          const boardPoint = shadowRoot.getElementById('board-point')
          const sliderThumb = shadowRoot.getElementById('slider-thumb')
          const hexInput = shadowRoot.getElementById('hex-input')
          const currentColor = shadowRoot.getElementById('current-color')
          const presetColorsContainer = shadowRoot.getElementById(
            'preset-colors-container'
          )

          // 初始化 Canvas
          const ctxSlider = colorSlider.getContext('2d')

          let isDraggingBoardPoint = false
          let isDraggingSliderPoint = false

          let previousHexValue = ''

          // 更新当前颜色显示
          const updateCurrentColor = (rgb) => {
            const hex = rgbToHex(rgb)
            hexInput.value = hex
            currentColor.style.backgroundColor = hex
            boardPoint.style.backgroundColor = hex
            this.onCurrentColorChangeCallback &&
              this.onCurrentColorChangeCallback(hex)
          }

          // 绘制色板
          function drawColorBoard() {
            colorBoard.style.background = `linear-gradient(to top, rgb(0, 0, 0), transparent), linear-gradient(to left, ${sliderThumb.style.backgroundColor}, transparent)`
          }
          drawColorBoard()

          // 绘制颜色条
          function drawColorSlider() {
            for (let x = 0; x < colorSlider.width; x++) {
              const hue = (x / colorSlider.width) * 360
              const rgb = hsvToRgb(hue, 1, 1)
              ctxSlider.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
              ctxSlider.fillRect(x, 0, 1, colorSlider.height)
            }
          }
          drawColorSlider()

          // HSV 转 RGB
          function hsvToRgb(h, s, v) {
            let r, g, b
            const i = Math.floor(h / 60) % 6
            const f = h / 60 - Math.floor(h / 60)
            const p = v * (1 - s)
            const q = v * (1 - f * s)
            const t = v * (1 - (1 - f) * s)
            switch (i) {
              case 0:
                ;(r = v), (g = t), (b = p)
                break
              case 1:
                ;(r = q), (g = v), (b = p)
                break
              case 2:
                ;(r = p), (g = v), (b = t)
                break
              case 3:
                ;(r = p), (g = q), (b = v)
                break
              case 4:
                ;(r = t), (g = p), (b = v)
                break
              case 5:
                ;(r = v), (g = p), (b = q)
                break
            }
            return {
              r: Math.round(r * 255),
              g: Math.round(g * 255),
              b: Math.round(b * 255),
            }
          }

          // RGB 转十六进制
          function rgbToHex(rgb) {
            return `#${((1 << 24) | (rgb.r << 16) | (rgb.g << 8) | rgb.b)
              .toString(16)
              .slice(1)}`
          }

          // 十六进制转 RGB
          function hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
            return result
              ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16),
                }
              : null
          }

          // RGB 转 Hue（色调）
          function rgbToHue(r, g, b) {
            r /= 255
            g /= 255
            b /= 255
            const max = Math.max(r, g, b)
            const min = Math.min(r, g, b)
            let h
            if (max === min) {
              h = 0 // achromatic
            } else {
              const d = max - min
              switch (max) {
                case r:
                  h = (g - b) / d + (g < b ? 6 : 0)
                  break
                case g:
                  h = (b - r) / d + 2
                  break
                case b:
                  h = (r - g) / d + 4
                  break
              }
              h /= 6
            }
            return h * 360
          }

          // RGB 转 Saturation（饱和度）
          function rgbToSaturation(r, g, b) {
            r /= 255
            g /= 255
            b /= 255
            const max = Math.max(r, g, b)
            const min = Math.min(r, g, b)
            const d = max - min
            const s = max === 0 ? 0 : d / max
            return s
          }

          // RGB 转 Brightness（亮度）
          function rgbToBrightness(r, g, b) {
            r /= 255
            g /= 255
            b /= 255
            return Math.max(r, g, b)
          }

          function updateBoardPointPosition(e) {
            const colorBoardRect = colorBoard.getBoundingClientRect()
            const x = Math.max(
              0,
              Math.min(colorBoardRect.width, e.clientX - colorBoardRect.left)
            )
            const y = Math.max(
              0,
              Math.min(colorBoardRect.height, e.clientY - colorBoardRect.top)
            )
            boardPoint.style.left = `${x}px`
            boardPoint.style.top = `${y}px`
            const brightness = 1 - y / colorBoardRect.height
            const saturation = x / colorBoardRect.width
            const rgb = hsvToRgb(
              sliderThumb.dataset.hue || 0,
              saturation,
              brightness
            )
            updateCurrentColor(rgb)
          }

          function updateSliderThumbPosition(e) {
            const colorSliderRect = colorSlider.getBoundingClientRect()
            const x = Math.max(
              0,
              Math.min(colorSlider.width, e.clientX - colorSliderRect.left)
            )
            sliderThumb.style.left = `${x}px`
            const hue = (x / colorSlider.width) * 360
            sliderThumb.dataset.hue = hue

            // 更新 slider-thumb 颜色
            const rgb = hsvToRgb(hue, 1, 1)
            const hex = rgbToHex(rgb)
            sliderThumb.style.backgroundColor = hex

            drawColorBoard()

            // 更新当前颜色
            const colorBoardRect = colorBoard.getBoundingClientRect()
            const boardPointRect = boardPoint.getBoundingClientRect()
            const x2 = Math.max(
              0,
              Math.min(
                colorBoardRect.width,
                boardPointRect.left +
                  boardPointRect.width / 2 -
                  colorBoardRect.left
              )
            )
            const y2 = Math.max(
              0,
              Math.min(
                colorBoardRect.height,
                boardPointRect.top +
                  boardPointRect.height / 2 -
                  colorBoardRect.top
              )
            )

            const brightness = 1 - y2 / colorBoardRect.height
            const saturation = x2 / colorBoardRect.width

            updateCurrentColor(hsvToRgb(hue, saturation, brightness))
          }

          hexInput.addEventListener(
            'focus',
            () => (previousHexValue = hexInput.value)
          )
          hexInput.addEventListener('input', (e) =>
            updateColorFromHex(e.target.value)
          )
          hexInput.addEventListener('blur', () => {
            const hex = hexInput.value
            const rgb = hexToRgb(hex)

            if (!rgb) {
              hexInput.value = previousHexValue
            } else {
              updateColorFromHex(hex)
            }
          })

          colorPicker.addEventListener('mousedown', (e) => {
            if (e.target === boardPoint || e.target === colorBoard) {
              isDraggingBoardPoint = true
              updateBoardPointPosition(e)
              boardContainer.style.cursor = 'grabbing'
            } else if (e.target === sliderThumb || e.target === colorSlider) {
              isDraggingSliderPoint = true
              updateSliderThumbPosition(e)
              colorSliderContainer.style.cursor = 'grabbing'
            }
          })

          shadowRoot.addEventListener('mousemove', (e) => {
            if (isDraggingBoardPoint) {
              updateBoardPointPosition(e)
            } else if (isDraggingSliderPoint) {
              updateSliderThumbPosition(e)
            }
          })

          shadowRoot.addEventListener('mouseup', () => {
            isDraggingBoardPoint = false
            isDraggingSliderPoint = false
            boardContainer.style.cursor = 'grab'
            colorSliderContainer.style.cursor = 'grab'
          })

          /**
           * 根据十六进制颜色值更新颜色选择器的状态
           * @param {string} hex - 十六进制颜色值
           */
          function updateColorFromHex(hex) {
            const rgb = hexToRgb(hex)
            if (!rgb) return null // 如果颜色无效，直接返回

            // 更新当前颜色显示
            updateCurrentColor(rgb)

            // 计算 HSV 值
            const hue = rgbToHue(rgb.r, rgb.g, rgb.b)

            // 更新颜色条控制点位置
            const sliderX = (hue / 360) * colorSlider.width
            sliderThumb.style.left = `${sliderX}px`
            sliderThumb.dataset.hue = hue

            const sliderThumbRGB = hsvToRgb(hue, 1, 1) // 饱和度和亮度固定为 1
            sliderThumb.style.backgroundColor = `rgb(${sliderThumbRGB.r}, ${sliderThumbRGB.g}, ${sliderThumbRGB.b})`

            // 更新色板控制点位置
            const colorBoardRect = colorBoard.getBoundingClientRect()
            const saturation = rgbToSaturation(rgb.r, rgb.g, rgb.b)
            const brightness = rgbToBrightness(rgb.r, rgb.g, rgb.b)
            const boardX = saturation * colorBoardRect.width
            const boardY = (1 - brightness) * colorBoardRect.height
            boardPoint.style.left = `${boardX}px`
            boardPoint.style.top = `${boardY}px`

            // 重新绘制色板
            drawColorBoard()

            return hex
          }

          /**
           * 将 RGB 字符串转换为 RGB 对象
           */
          function rgbStringToRgbObject(rgbString) {
            const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgbString)
            return result
              ? {
                  r: parseInt(result[1], 10),
                  g: parseInt(result[2], 10),
                  b: parseInt(result[3], 10),
                }
              : null
          }

          /**
           * 设置预设颜色
           */
          this.setPresetColors = (colors) => {
            presetColorsContainer.innerHTML = ''
            colors.forEach((hex) => {
              const colorBlock = document.createElement('div')
              colorBlock.className = 'color-block'
              colorBlock.style.backgroundColor = hex
              colorBlock.addEventListener('click', () =>
                updateColorFromHex(hex)
              )
              presetColorsContainer.appendChild(colorBlock)
            })
          }

          /**
           * 设置颜色（以 HEX 形式）
           */
          this.setColor = (hex) => updateColorFromHex(hex)

          /**
           * 获取颜色（以 HEX 形式）
           */
          this.getColor = () => hexInput.value

          /**
           * 设置当前颜色变化的回调函数
           */
          this.onCurrentColorChange = (callback) =>
            (this.onCurrentColorChangeCallback = callback)

          this.destroy = () => {
            // 中止所有事件监听器
            this.controller.abort()

            // 清空 Shadow DOM
            this.shadowRoot.innerHTML = ''

            // 重置状态
            this.onCurrentColorChangeCallback = null
          }
        }
      }

      // 注册自定义元素
      customElements.define('color-picker', ColorPicker)

      // 示例用法
      const picker = document.createElement('color-picker')
      picker.style.display = 'flex'
      picker.style.justifyContent = 'center'
      document.body.appendChild(picker)
      const presetColors = [
        '#FFFFFF',
        '#000000',
        '#0000FF',
        '#00FFFF',
        '#00FF00',
        '#800080',
        '#FF0000',
        '#FFFF00',
      ]
      picker.setPresetColors(presetColors)
      picker.setColor(presetColors[0]) // 设置初始颜色
      picker.onCurrentColorChange((color) => {
        console.log('当前颜色:', color)
      })
      console.log(picker.getColor()) // 获取当前颜色
    </script>
  </body>
</html>
```
