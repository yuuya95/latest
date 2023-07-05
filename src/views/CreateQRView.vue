<template>
    <div class="createQR">
        <div id="inputForm">
        <input type="text" v-model="formInput.inputText" v-on:keydown="generate" v-bind="formInput">
        </div>
        <vue-qrcode v-if="generateText" :value="generateText" :options="option" tag="img"></vue-qrcode>
    </div>
</template>

<script>
import VueQrcode from "@chenfengyuan/vue-qrcode";
import {collection, doc, updateDoc, getDocs, onSnapshot, addDoc, query, orderBy, deleteDoc, setDoc} from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { db } from "../firebase";
import QRCodeGenerator from "../components/QRCodeGenerator.vue"

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

<script setup>
const props = defineProps({
  msg: String
})
</script>