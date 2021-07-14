<template>
  <el-form ref="form" :model="form" inline :rules="rules">
    <el-form-item prop="num1">
      <el-input
        :maxlength="1"
        @input="handleInput('num1', ...arguments)"
        ref="input"
        class="sign-in-input"
        autofocus
        v-model.number="form.num1"
        @focus="handleFocus('input')"
      ></el-input>
    </el-form-item>
    <el-form-item prop="num2">
      <el-input
        :maxlength="1"
        @input="handleInput('num2', ...arguments)"
        ref="input1"
        class="sign-in-input"
        v-model.number="form.num2"
        @focus="handleFocus('input1')"
      ></el-input>
    </el-form-item>
    <el-form-item prop="num3">
      <el-input
        :maxlength="1"
        @input="handleInput('num3', ...arguments)"
        ref="input2"
        class="sign-in-input"
        v-model.number="form.num3"
        @focus="handleFocus('input2')"
      ></el-input>
    </el-form-item>
    <el-form-item prop="num4">
      <el-input
        :maxlength="1"
				@keyup.backspace.native="handleA"
        @input="handleInput('num4', ...arguments)"
        ref="input3"
        class="sign-in-input"
        v-model.number="form.num4"
        @focus="handleFocus('input3')"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  watch: {
    "form.num1"(newVal) {
      if (this.num2) return;
      if (newVal) {
        this.$refs.form.validate().then((res) => {
        this.$emit("success",this.getCipher());
				}).catch(() => {
            this.$refs.input1.focus();
          });
      }
    },
    "form.num2"(newVal) {
      if (this.num3) return;
      if (newVal) {
        this.$refs.form.validate().then((res) => {
        this.$emit("success",this.getCipher());
					}).catch(() => {
            this.$refs.input2.focus();
          });
      }
    },
    "form.num3"(newVal) {
      if (this.num4) return;
      if (newVal) {
        this.$refs.form.validate() .then((res) => {
        this.$emit("success",this.getCipher());
				}).catch(() => {
            this.$refs.input3.focus();
          });
      }
    },
    "form.num4"(newVal,el) {
      const form = this.form;
      // alert('good')
      this.$refs.form.validate().then((res) => {
        this.$emit("success",this.getCipher());
        console.log(111);
      });
    },
  },
  data() {
    this.rules = {
      num1: [{ required: true, message: "请输入" }],
      num2: [{ required: true, message: "请输入" }],
      num3: [{ required: true, message: "请输入" }],
      num4: [{ required: true, message: "请输入" }],
    };
    return {
      form: {
        num1: null,
        num2: null,
        num3: null,
        num4: null,
      },
    };
  },
  mounted() {
    // this.$refs.input.focus()
  },
  methods: {
    getCipher() {
      let str = "";
      for (const key in this.form) {
        str += this.form[key];
      }
      return str
    },
    handleChange(val) {
      console.log();
    },
    handleFocus(str) {
      this.$refs[str].select();
    },
    handleInput(str, val) {
      this.form[str] = val.replace(/[^\d]/g, "");
    },
		handleA() {
		  this.$refs.input2.focus();
		}
  },
};
</script>

<style lang="scss" scoped>
.sign-in {
  &-input {
    width: 100px;
    margin-right: 52px;
    color: red;
    >>> .el-input__inner {
      text-align: center;
    }
  }
}
</style>