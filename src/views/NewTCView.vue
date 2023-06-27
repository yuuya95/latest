<template>
  <div class="editor">
    <p><input type="text" placeholder="title" v-model="title"></p>
    詳細<p><textarea v-model="describe" cols="30" rows="10"></textarea></p>
    <p><input type="datetime-local" v-model="time"/></p>
    <input type="number" placeholder="学年" v-model="grade">
    <input type="number" placeholder="組" v-model="classes">
    <p><button @click="getUser(this.grade, this.classes)">検索</button></p>
    <p><select id="user" v-model="selected_users" multiple>
      <option v-for="user in users" :key="user" v-bind:value="user" >{{ user.data.name }}</option>
    </select></p>
    <p><button @click="push()">追加</button></p>
    <div>
      <p v-for="sl_user in sl_users" :key="sl_user">{{sl_user}}</p>
    </div>
    <p><button @click="createMeeting({title: this.title, describe: this.describe, time: Timestamp.fromDate(new Date(this.time))})">ミーティングを作成</button></p>
  </div>
</template>

<script>
import {collection, ref, doc, updateDoc, where, getDocs, onSnapshot, addDoc, query, orderBy, deleteDoc, setDoc, Timestamp} from "firebase/firestore";
import { db } from "../firebase";
export default {
  name: 'NewTCView',
  methods:{
    async createMeeting(data){
      const colRef = collection(db, "meeting")
      const docRef = await addDoc(colRef, data)
      // const meeting_user_Ref = collection(db, "meeting_user");
      await Promise.all(this.sl_users.map(async sl_user => {
        const data2 = {
          userID: sl_user.id,
          meetingID: docRef.id,
          firstTime: null,
          lastTime: null,
        }
        await addDoc(collection(db, "meeting_user"), data2)
      }))
      this.$router.push("/")
    },

    async getUser(){
      const q = query(collection(db, "user"), where("classes", "==", String(this.classes)), where("grade", "==", String(this.grade)));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const data = {id: doc.id, data: doc.data()}
        this.users.push(data)
        console.log(doc.id, " => ", doc.data());
      });
    },

    push: function(){
      this.users = []
      this.selected_users.forEach(user => this.sl_users.push(user));
      this.selected_users = []
    }

    // async UpdateTodo(col, obj, id){
    //   const colRef = collection(db, col)
    //   const docRef = doc(colRef, id);
    //   await updateDoc(docRef, obj);
    //   this.moveNextScreen('about')
    // },

    // moveNextScreen: function (path) {
    //   this.$router.push(path)
    // }
  },
  data() {
    return{
      title: "",
      selected_users: [],
      sl_users: [],
      users: [],
      grade: null,
      classes: null,
      describe: "",
      time: null,
    }
  }
}
</script>

<script setup>
// import {doc, collection, getDocs, onSnapshot, addDoc, query, orderBy, deleteDoc, setDoc} from "firebase/firestore";
// import { ref, reactive, onMounted } from "vue";
// import { db } from "../firebase";

// const collectionRef = await collection(db, "todo");

</script>
