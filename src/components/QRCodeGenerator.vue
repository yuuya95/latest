<script setup>
const props = defineProps({
  msg: String
})
</script>

<script>
import VueQrcode from "@chenfengyuan/vue-qrcode";

export default {
  components: {
    VueQrcode
  },
  data() {
    return {
      formInput: {
        placeholder: 'QRコードを生成したい文字を入力してください', 
        size: 50, 
        inputText: "",
      },
      option: {
        errorCorrectionLevel: "M",
        maskPattern: 0,
        margin: 10,
        scale: 2,
        width: 500,
        color: {
          dark: "#000000FF",
          light: "#FFFFFFFF"
        }
      }
    };
  },
  methods: {
    generate: function() {
      this.generateText = this.formInput.inputText;
    }
  }
};
</script>

<template>
  <h1>{{ msg }}</h1>
  <div>
    <div id="inputForm">
      <input type="text" v-model="formInput.inputText" v-on:keydown="generate" v-bind="formInput">
    </div>
    <vue-qrcode v-if="generateText" :value="generateText" :options="option" tag="img"></vue-qrcode>
  </div>
</template>