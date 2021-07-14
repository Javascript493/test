<template>
  <div id="container">
    <h4>{{ handTitle }}</h4>
    <canvas ref="canvasRef" width="500" height="500"> </canvas>
  </div>
</template>

<script>
import utils from "./mixins/index";
export default {
  mixins: [utils],
  props: {
    // 默认展示的连线
    pointDefault: {
      type: String,
      default: "",
    },
    // 正确的连线
    pointCorrect: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      handTitle: "绘制手势解锁",
      points: [], // 初始手势圆坐标集合
      restPoints: [], // 手势未选中的圆坐标集合
      choosePoints: [], // 手势选中的圆坐标集合
      touchFlag: false, // 初始点是否处于手势圆中
      r: 0, // 圆半径,
      rWidth: 2, // 圆宽
      currentLines: "", // 选择的
      ctx: null, // canvas上下文对象
    };
  },
  mounted() {
    this.initData();
    const remove = this.bindEvents(this.$refs.canvasRef);
    this.$once("hook:beforeDestroy", () => {
      remove()
    });
  },

  methods: {
    // 初始化
    initData() {
      const canvasDom = this.$refs.canvasRef;
      const ctx = canvasDom.getContext("2d");
      this.ctx = ctx;
      this.createHandCircle(canvasDom);
      if (this.pointDefault) {
        this.defaultDraw();
      }
    },
    // 创建初始手势圆
    createHandCircle(canvasDom) {
      // 重置数据
      this.handTitle = "绘制手势解锁";
      this.points = [];
      this.choosePoints = [];
      this.restPoints = [];
      this.touchFlag = false;
      // 重置绘制
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      const line_handNum = 3; // 每行手势圆数量
      const r = canvasDom.width / (2 + 4 * line_handNum); // 总宽度拆分为半径数
      this.r = r;
      for (let index = 1; index <= line_handNum * line_handNum; index++) {
        const row = Math.ceil(index / line_handNum) - 1;
        const column =
          (index % line_handNum == 0 ? line_handNum : index % line_handNum) - 1;
        const x = (2 + 4 * column + 1) * r; // x坐标点
        const y = (2 + 4 * row + 1) * r; // y坐标点
        const point = {
          x,
          y,
          index,
        };
        this.points.push(point);
        this.restPoints.push(point);
        this.drawCle(x, y, "#CFE6FF");
      }
    },
    // 绑定手势触发事件
    bindEvents(canvasDom) {
      const arr = [
        { name: "mousedown", fnc: this.touchStart },
        { name: "mousemove", fnc: this.touchMove },
        { name: "mouseup", fnc: this.touchEnd },
      ];
      arr.forEach((v) => {
        canvasDom.addEventListener(v.name, v.fnc, false);
      });
      return () => {
        arr.forEach((v) => {
          canvasDom.removeEventListener(v.name, v.fnc, false);
        });
      };
    },
    touchStart(e) {
      // 清空
      this.choosePoints = [];
      // point有x和y，并且是相较于canvas边距
      var point = this.getPosition(e);
      // 判断是否在圆内的原理：勾股定理(x坐标与y坐标的平方小于等于r半径的平方) x*x+y*y <= r*r 在圆内
      for (var i = 0; i < this.points.length; i++) {
        const x_len = Math.abs(point.x - this.points[i].x);
        const y_len = Math.abs(point.y - this.points[i].y);
        if (Math.pow(x_len, 2) + Math.pow(y_len, 2) <= Math.pow(this.r, 2)) {
          this.touchFlag = true;
          // lastPoints存放的就是选中的圆圈的x/y坐标值
          this.choosePoints.push(this.points[i]); // +1
          this.restPoints.splice(i, 1); // -1
          break;
        }
      }
    },
    touchMove(e) {
      // touchmove做的就是：画圆drawChoosePoint和划线drawLine
      if (this.touchFlag) {
        this.handleTouchMove(this.getPosition(e));
      }
    },
    touchEnd(e) {
      const _this = this;
      if (this.touchFlag) {
        this.storePass();
        let timer = setTimeout(function () {
          _this.drawEnd(_this.currentLines);
          _this.initData();
          clearTimeout(timer);
        }, 500);
      }
    },
    // 手势移动处理方法
    handleTouchMove(point) {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      // 重新画9个圆圈
      for (var i = 0; i < this.points.length; i++) {
        // 每帧先把面板画出来
        this.drawCle(this.points[i].x, this.points[i].y, "#CFE6FF");
      }
      this.drawChoosePoint("draw"); // 画选中圆
      this.drawLine(point); // 画连接线
      // 1、检测手势移动的位置是否处于下一个圆内
      // 2、圆内的话则画圆 drawChoosePoint
      // 3、已经画过实心圆的圆，无需重复检测
      for (var i = 0; i < this.restPoints.length; i++) {
        const x_len = Math.abs(point.x - this.restPoints[i].x);
        const y_len = Math.abs(point.y - this.restPoints[i].y);
        if (Math.pow(x_len, 2) + Math.pow(y_len, 2) <= Math.pow(this.r, 2)) {
          this.drawChoosePoint();
          this.choosePoints.push(this.restPoints[i]);
          this.restPoints.splice(i, 1);
          break;
        }
      }
    },
    // 画初始圆环
    drawCle(x, y, color) {
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.drawRound(this.ctx, x, y, this.r, 0, Math.PI * 2);
      this.ctx.stroke();
    },
    // 画选中点的圆
    drawChoosePoint(type) {
      const ctx = this.ctx;
      let color = "red";
      for (var i = 0; i < this.choosePoints.length; i++) {
        const x = this.choosePoints[i].x;
        const y = this.choosePoints[i].y;
        i === 0 && type === "default" ? (color = "red") : (color = "#35F6CF");
        // 选中圆的边框
        this.drawCle(x, y, color);
        // 填充圆
        ctx.fillStyle = "#1F2C30";
        this.drawRound(ctx, x, y, this.r - 2, 0, Math.PI * 2);
        ctx.fill();
        // 圆点
        ctx.fillStyle = color;
        this.drawRound(ctx, x, y, 12, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    // 画选中点的圆的连线，最后连上手势当前点
    drawLine(point) {
      this.ctx.beginPath();
      this.ctx.lineWidth = 2;
      this.ctx.moveTo(this.choosePoints[0].x, this.choosePoints[0].y);
      for (var i = 1; i < this.choosePoints.length; i++) {
        this.ctx.lineTo(this.choosePoints[i].x, this.choosePoints[i].y);
      }
      if (point) {
        this.ctx.lineTo(point.x, point.y);
      }
      this.ctx.stroke();
      this.ctx.closePath();
    },
    // 手势路径检测
    storePass() {
      if (this.checkPass()) {
        this.drawStatusPointColor("#2CFF26");
      } else {
        this.drawStatusPointColor("red");
      }
    },
    // 检测手势点连线与初始点手势连线是否一致
    checkPass() {
      this.currentLines = "";
      for (let i = 0; i < this.choosePoints.length; i++) {
        this.currentLines += this.choosePoints[i].index;
      }
      return this.pointCorrect === this.currentLines;
    },
    // 绘制不同检测状态的点颜色
    drawStatusPointColor(color) {
      for (var i = 0; i < this.choosePoints.length; i++) {
        const ctx = this.ctx;
        const x = this.choosePoints[i].x;
        const y = this.choosePoints[i].y;
        // 选中圆的边框
        this.drawCle(x, y, color);
        // 填充圆
        ctx.fillStyle = "#1F2C30";
        this.drawRound(ctx, x, y, this.r - 2, 0, Math.PI * 2);
        ctx.fill();
        // 圆点
        ctx.fillStyle = color;
        this.drawRound(ctx, x, y, this.r / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    // 画出默认设置的手势
    defaultDraw() {
      const arrIndex = this.pointDefault.split("").map((i) => {
        return { index: Number(i), x: 0, y: 0 };
      });
      this.choosePoints = _.intersectionBy(this.points, arrIndex, "index");
      this.drawChoosePoint("default");
      this.drawLine();
    },
  },
};
</script>

<style lang="scss" scoped>
#container {
  width: 100%;
  height: 700px;
  text-align: center;
  background: #305066;
  h4 {
    padding: 50px 0 25px 0;
    color: #22ceaa;
    font-size: 30px;
  }
}
</style>