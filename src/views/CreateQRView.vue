<template>
    <div class="createQR">
      <h1>あなたのQRコード</h1>
      <div>
        <vue-qrcode v-if="targetText" :value="targetText" :options="option" tag="img"></vue-qrcode>
      </div>
    </div>
</template>

<script>
import VueQrcode from "@chenfengyuan/vue-qrcode";
import {collection, doc, updateDoc, getDoc, onSnapshot, addDoc, query, orderBy, deleteDoc, setDoc} from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { db } from "../firebase";

export default {
  components: {
    VueQrcode
  },
  data() {
    return {
      currentUserID: null,
      inputText: "",
      targetText: "",
      option: {
        errorCorrectionLevel: "M",
        maskPattern: 0,
        margin: 10,
        scale: 2,
        width: 300,
        color: {
          dark: "#000000FF",
          light: "#FFFFFFFF"
        }
      }
    };
  },
  methods: {
    auth: function() {
      return new Promise(resolve => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
          if(user == null){ 
            resolve([false, "a"]);
          }else{
            resolve([true, user.uid]);
          }
        })
      })
    }
  },
  async mounted(){
    await this.auth();
    const userID = await this.auth();
    if(userID[0]){
      const docRef = doc(db, "user", userID[1]);
      const docSnap = await getDoc(docRef);
      this.targetText = docSnap.data().grade + "," + docSnap.data().classes + "," + docSnap.data().num
    }
  }
};
</script>
