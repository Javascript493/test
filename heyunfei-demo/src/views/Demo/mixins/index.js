export default {
	data() {
		return {

		}
	},
	methods: {
		// 画圆
		drawRound(ctx, x, y, r, start, end) {
			// canvasdmo 圆心x,y , 起始点 结束点
			ctx.beginPath();
			ctx.arc(x, y, r, start, end, true);
			ctx.closePath();
		},
		// 获取手势当前坐标点
		getPosition(e) {
			const point = {
				x: e.layerX,
				y: e.layerY,
			};
			return point;
		},
		drawEnd(val){
			this.$emit('draw-end',val)
			console.log(val)
		}
	}
}