<template>
  <div class="editor">
    <div class="tip1">
      <p>ミーティング名</p>
      <p><input type="text" placeholder="ミーティング名を入力" v-model="title"></p>
    </div>
    <div class="tip">
      <p>詳細</p>
      <p><textarea v-model="describe" cols="30" rows="10"></textarea></p>
    </div>
    <div class="tip">
      <p>ミーティング開始時間</p>
      <p><input type="datetime-local" v-model="time"/></p>
    </div>
    <div class="tip">
      <p>検索</p>
      <p>学年<select v-model="grade" id="grade">
        <option value="" disabled selected style="display:none;">学年を選択</option>
        <option value=1>中学1年</option>
        <option value=2>中学2年</option>
        <option value=3>中学3年</option>
        <option value=4>高校1年</option>
        <option value=5>高校2年</option>
        <option value=6>高校3年</option>
      </select></p>
      <p>クラス<select v-model="classes" id="classes">
          <option value="" disabled selected style="display:none;">クラスを選択</option>
          <option value=1>1組</option>
          <option value=2>2組</option>
          <option value=3>3組</option>
          <option value=4>4組</option>
          <option value=5>5組</option>
          <option value=6>6組</option>
      </select></p>
      <p><button @click="getUser(this.grade, this.classes)">検索</button></p>
      <p><select id="user" v-model="selected_users" multiple>
        <option v-for="user in users" :key="user" v-bind:value="user" >{{ user.data.name }}</option>
      </select></p>
      <p><button @click="push()">追加</button></p>
    </div>
    <div class="tip">
      <p>選択中</p>
      <p><select id="user" v-model="remove_users" multiple>
        <option v-for="sl_user in sl_users" :key="sl_user" v-bind:value="sl_user" >{{ sl_user.data.name }}</option>
      </select></p>
      <p><button @click="remove()">削除</button></p>
    </div>
    <div class="tip">
      <p><button @click="createMeeting({title: this.title, describe: this.describe, time: new Date(this.time), createdAt: new Date()})">ミーティングを作成</button></p>
    </div>
  </div>
</template>

<script>
import {collection, ref, doc, updateDoc, where, getDocs, onSnapshot, addDoc, query, orderBy, deleteDoc, setDoc, Timestamp} from "firebase/firestore";
import { db } from "../firebase";
import Detector from "@zxing/library/esm/core/aztec/detector/Detector";
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
      this.users = []
      const q = query(collection(db, "user"), where("classes", "==", String(this.classes)), where("grade", "==", String(this.grade)), orderBy("num", "asc"));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const data = {id: doc.id, data: doc.data()}
        this.users.push(data)
        console.log(doc, " => ", doc.data());
      });
    },

    push: function(){
      this.users = []
      this.selected_users.forEach(user => this.sl_users.push(user));
      this.selected_users = []
    },

    remove: function(){
      this.sl_users.forEach((sl_user, index) => {
        this.remove_users.forEach((remove_user) => {
          if(sl_user == remove_user){
            this.sl_users.splice(index, 1);
          }
        })
      })
      console.log(this.remove_users, this.sl_users)
    },
  },
  data() {
    return{
      title: "",
      selected_users: [],
      sl_users: [],
      remove_users: [],
      users: [],
      grade: null,
      classes: null,
      describe: "",
      time: null,
    }
  }
}
</script>

<style scoped>
.tip{
  margin: 70px 0px;
}

.tip1{
  margin: 0px 0px 70px 0px;
}

p{
  margin: 5px 0px;
  font-weight: bold;
}
</style>