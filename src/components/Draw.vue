<template>
  <div class="draw-container">
    <canvas v-if="isPc"
      id="myCanvas"
      width="300"
      height="300"
      @mousedown.left="mouseDown"
      @mousemove="mouseMove"
      @mouseup="mouseUp"></canvas>

    <canvas v-else
      id="myCanvas"
      width="300"
      height="300"
      @touchstart="start"
      @touchmove="move"
      @touchend="end"/>

    <div class="footer">
      <div @click="clearCanvas">清空</div>
      <div @click="changeColor('red')" class="red" :class="{active: color == 'red'}"></div>
      <div @click="changeColor('yellow')" class="yellow" :class="{active: color == 'yellow'}"></div>
      <div @click="changeColor('green')" class="green" :class="{active: color == 'green'}"></div>
      <div @click="changeColor('#000')" class="black" :class="{active: color == '#000'}"></div>
      <div @click="changeColor('#fff')" :class="{active: color == '#fff'}">橡皮</div>
      <div @click="changeLineWidth(1)" class="width1" :class="{active: size == 1}"></div>
      <div @click="changeLineWidth(2)" class="width2" :class="{active: size == 2}"></div>
      <div @click="changeLineWidth(3)" class="width3" :class="{active: size == 3}"></div>
      <div @click="changeLineWidth(5)" class="width5" :class="{active: size == 5}"></div>
    </div>
    <div @click="getImage">生成图片({{ isPc ? '可右键图片另存' : '可长按保存' }})</div>
    <div ref="imageBox"></div>
  </div>
</template>

<script>
export default {
  name: 'Canvas',
  data () {
    return {
      x: 0,
      y: 0,
      color: '#000',
      size: 1
    }
  },
  computed: {
    isPc () {
      const userAgentInfo = navigator.userAgent.toLowerCase()
      var agents = ['android', 'iphone', 'symbianos', 'windows phone', 'ipad', 'ipod']
      var flag = true
      for (var v = 0; v < agents.length; v++) {
        if (userAgentInfo.indexOf(agents[v]) > 0) {
          flag = false
          break
        }
      }
      return flag
    }
  },
  mounted () {
    this.canvas = document.getElementById('myCanvas')
    this.ctx = this.canvas.getContext('2d')
  },
  methods: {
    start (e) {
      this.x = e.touches[0].pageX - e.touches[0].target.offsetLeft
      this.y = e.touches[0].pageY - e.touches[0].target.offsetTop
      this.ctx.moveTo(this.x, this.y)
      this.ctx.lineTo(this.x + 1, this.y + 1)
      this.ctx.stroke()
      this.ctx.beginPath()
    },
    move (e) {
      e.preventDefault()
      this.ctx.moveTo(this.x, this.y)
      let x = e.touches[0].pageX - e.touches[0].target.offsetLeft
      let y = e.touches[0].pageY - e.touches[0].target.offsetTop
      this.ctx.lineTo(x, y)
      this.x = x
      this.y = y
      this.ctx.stroke()
      this.ctx.beginPath()
    },
    end (e) {
    },
    mouseDown (e) {
      this.drawing = true
      this.x = e.offsetX
      this.y = e.offsetY
      this.ctx.moveTo(this.x, this.y)
      this.ctx.lineTo(this.x + 1, this.y + 1)
      this.ctx.stroke()
      this.ctx.beginPath()
    },
    mouseMove (e) {
      if (this.drawing) {
        e.preventDefault()
        this.ctx.moveTo(this.x, this.y)
        let x = e.offsetX
        let y = e.offsetY
        this.ctx.lineTo(x, y)
        this.x = x
        this.y = y
        this.ctx.stroke()
        this.ctx.beginPath()
      }
    },
    mouseUp (e) {
      this.drawing = false
    },
    clearCanvas () {
      this.color = '#000'
      this.size = 1
      this.canvas.height = this.canvas.height
    },
    changeColor (color) {
      this.color = color
      this.ctx.strokeStyle = color
    },
    changeLineWidth (width) {
      this.size = width
      this.ctx.lineWidth = width
    },
    getImage () {
      var img = document.createElement('img')
      img.src = this.canvas.toDataURL('image/png')
      var imgBox = this.$refs.imageBox
      if (imgBox.hasChildNodes()) {
        imgBox.replaceChild(img, imgBox.lastChild)
      } else {
        imgBox.appendChild(img)
      }
    }
  }
}
</script>

<style scoped>
.draw-container {
  text-align: center;
}

#myCanvas {
  border:1px solid;
  margin:3px;
  cursor: pointer;
}

.footer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer div {
  margin: 8px;
}

.footer .red {
  background-color: red;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.footer .yellow {
  background-color: yellow;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.footer .green {
  background-color: green;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.footer .black {
  background-color: #000;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.footer .width1 {
  background-color: #ccc;
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

.footer .width2 {
  background-color: #ccc;
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.footer .width3 {
  background-color: #ccc;
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.footer .width5 {
  background-color: #ccc;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.footer .active {
  position: relative;
  top: -5px;
  box-shadow: #000 0px 0px 10px;
}
</style>
