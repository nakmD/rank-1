<template>
  <canvas width="200" height="40" class="canvas"></canvas>
</template>

<script>
export default {
  props: {
    bar: {
      type: Number,
      default: 0
    }
  },
  watch: {
    bar () {
      this.draw()
    }
  },
  methods: {
    draw () {
      const barLength = 100 * this.bar
      console.log(`bar-component: ${barLength}, ${this.bar}`)
      this.ctx.beginPath()
      this.ctx.clearRect(20, 10, 200, 20) // 描画領域をクリアすると左にも動く
      this.ctx.fillRect(20, 10, barLength, 20) // ctx.fillRect(X座標, Y座標, 幅, 高さ);
      this.ctx.fill()
      // let component = this.$ref.canvas;
    }
  },
  mounted () {
    // mounted 以降で canvas の DOM にアクセスできる
    // CreateJS などを使うときにも、ここで canvas と紐付ける
    // console.log(this.$el)
    this.ctx = this.$el.getContext('2d')
    this.draw()
  }
}
</script>

<style scoped>
.canvas {
  background-color: rgb(255, 100, 50);
}
@media screen and (max-width: 700px) {
  canvas {
    height: 20px;
  }
}
</style>
