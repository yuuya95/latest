<template>
    <div>
      <p class="error">{{ error }}</p>
  
      <p class="decode-result">Last result: <b>{{ result }}</b></p>
  
      <qrcode-stream @decode="onDecode" @init="onInit" />

      <p><router-link :to="{ name: 'oneMeeting', params: { id: this.$route.params.id }}">戻る</router-link></p>
    </div>
  </template>
  
  <script>
  import {
    collection,
    doc,
    updateDoc,
    getDocs,
    onSnapshot,
    addDoc,
    query,
    orderBy,
    deleteDoc,
    setDoc,
    where,
    serverTimestamp,
  } from "firebase/firestore";
import { db } from "../firebase";
import { QrcodeStream } from "vue3-qrcode-reader";
  
  export default {
    name: "QRLastView",
    components: { QrcodeStream },
  
    data () {
      return {
        result: '',
        error: '',
        userID: "",
        docRef: null,
      }
    },
  
    methods: {
      onDecode: async function (result) {
        const user_desc = result.split(",");
        const q1 = query(collection(db, "user"), where("classes", "==", user_desc[1]), where("grade", "==", user_desc[0]), where("num", "==", user_desc[2]));
        const querySnapshot1 = await getDocs(q1);
        
        querySnapshot1.forEach((doc) => {
          this.userID = doc.id;
          console.log(doc.id)
        });
        console.log("a", querySnapshot1, querySnapshot1.data)


        const q = query(collection(db, "meeting_user"), where("userID", "==", this.userID), where("meetingID", "==", String(this.$route.params.id)));

        const querySnapshot = await getDocs(q);
        console.log("b", querySnapshot, querySnapshot.data)

        querySnapshot.forEach((document) => {
          this.docRef = doc(db, "meeting_user", document.id);
          console.log("b")
        });
        console.log(this.type)

        await updateDoc(this.docRef, {
          "lastTime": serverTimestamp(),
        })
      },
  
      async onInit (promise) {
        try {
          await promise
        } catch (error) {
          if (error.name === 'NotAllowedError') {
            this.error = "ERROR: you need to grant camera access permission"
          } else if (error.name === 'NotFoundError') {
            this.error = "ERROR: no camera on this device"
          } else if (error.name === 'NotSupportedError') {
            this.error = "ERROR: secure context required (HTTPS, localhost)"
          } else if (error.name === 'NotReadableError') {
            this.error = "ERROR: is the camera already in use?"
          } else if (error.name === 'OverconstrainedError') {
            this.error = "ERROR: installed cameras are not suitable"
          } else if (error.name === 'StreamApiNotSupportedError') {
            this.error = "ERROR: Stream API is not supported in this browser"
          } else if (error.name === 'InsecureContextError') {
            this.error = 'ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.';
          } else {
            this.error = `ERROR: Camera error (${error.name})`;
          }
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .error {
    font-weight: bold;
    color: red;
  }
  </style>