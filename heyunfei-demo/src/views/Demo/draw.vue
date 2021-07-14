<template>
  <div>
		asdsa
		{{current}}
		<darw-tu pointDefault="123456789" pointCorrect="123456789" @draw-end="handleSelectEnd"/>
	</div>
</template>

<script>
import DarwTu from "./demo.vue";
export default {
  components: {
    DarwTu,
  },
	data(){
		return {
			current:''
		}
	},
	methods:{
		handleSelectEnd(val){
			this.current = val
		}
	}
};
</script>

<style>
</style>