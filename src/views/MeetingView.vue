<template>
  <div class="meeting">
    <h1>{{ meeting.title }}</h1>
    <p>{{ meeting.describe }}</p>
    <!-- <router-link :to="{ name: 'oneMeetingPerson', params: { id: meeting.id }}">登録者を確認</router-link> -->
    <p><router-link :to="{ name: 'QRreaderFirst', params: { id: meeting.id }}">入室確認</router-link></p>
    <p><router-link :to="{ name: 'QRreaderLast', params: { id: meeting.id }}">退室確認</router-link></p>
    <p><router-link :to="{ name: 'attendance', params: { id: meeting.id }}">出席確認</router-link></p>
    <p><button @click="choose()">変更する</button></p>
    <div v-if="allow">
      <p><button @click="change_title()">ミーティング名を変更する</button></p>
      <div v-if="title_allow">
        <p><input type="text" placeholder="ミーティング名を入力" v-model="title"></p>
      </div>
      <p><button @click="change_describe()">詳細を変更する</button></p>
      <div v-if="describe_allow">
        <p><textarea v-model="describe" cols="30" rows="10"></textarea></p>
      </div>
      <p><button @click="change_date()">日付を変更する</button></p>
      <div v-if="date_allow">
        <p><input type="datetime-local" v-model="time"/></p>
      </div>
      <p><button @click="change_user()">参加者を変更する</button></p>
      <div v-if="user_allow">
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
        <p><button @click="pushing()">追加</button></p>
        <div class="tip">
          <p>選択中</p>
          <p><select id="user" v-model="remove_users" multiple>
            <option v-for="user2 in users2" :key="user2" v-bind:value="user2" >{{ user2.name }}</option>
          </select></p>
          <p><button @click="remove()">削除</button></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  collection,
  doc,
  updateDoc,
  getDoc,
  onSnapshot,
  addDoc,
  query,
  orderBy,
  deleteDoc,
  setDoc,
  where, getDocs
} from "firebase/firestore";
import { db } from "../firebase";
export default {
  name: "MeetingView",
  methods: {
    choose: function(){
      if(this.allow){
        this.allow = false;
      }else{
        this.allow = true
      }
    },
    change_title: function(){
      if(this.title_allow){
        this.title_allow = false;
      }else{
        this.title_allow = true;
      }
    },
    change_describe: function(){
      if(this.describe_allow){
        this.describe_allow = false;
      }else{
        this.describe_allow = true;
      }
    },
    change_date: function(){
      if(this.date_allow){
        this.date_allow = false;
      }else{
        this.date_allow = true;
      }
    },
    change_user: function(){
      if(this.user_allow){
        this.user_allow = false;
      }else{
        this.user_allow = true;
      }
    },
    async pushing(){
      await Promise.all(this.selected_users.map(async user => {
        this.users2.push(user.data)
        const data2 = {
          userID: user.id,
          meetingID: this.$route.params.id,
          firstTime: null,
          lastTime: null,
        }
        await addDoc(collection(db, "meeting_user"), data2)
      }));
      this.users = []
      this.selected_users = []
    },
    async remove(){
      await Promise.all(this.users2.map(async (user, index) => {
        await Promise.all(this.remove_users.map(async (remove_user) => {
          if(user == remove_user){
            console.log("b", user)
            const q1 = query(collection(db, "user"), where("classes", "==", user.classes), where("grade", "==", user.grade), where("num", "==", user.num));
            const querySnapshot1 = await getDocs(q1);
            querySnapshot1.forEach((doc) => {
              this.userID = doc.id;
            });
            this.users2.splice(index, 1);
            const q = query(collection(db, "meeting_user"),  where("meetingID", "==", this.$route.params.id),  where("userID", "==", this.userID));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
              await deleteDoc(doc.ref)
            });
          }
        }))
      }))
      console.log(this.remove_users, this.selected_users)
    },
    async showTodo() {
      const docRef = doc(db, "meeting", this.$route.params.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        this.meeting.title = docSnap.data().title;
        this.meeting.describe = docSnap.data().describe;
      } else {
        // doc.data() がUndefinedの場合の処理
        console.log("No such document!");
      }
    },
    async getAttendance(){
      console.log(this.$route.params.id)
        const q = query(collection(db, "meeting_user"),  where("meetingID", "==", this.$route.params.id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const obj = {id: doc.id}
            let allObj = Object.assign(obj, doc.data());
            this.meeting_users.push(allObj)
        });

        await Promise.all(this.meeting_users.map(async meeting_user => {
            const docRef = doc(db, "user", meeting_user.userID);
            const docSnap = await getDoc(docRef);
            

            if (docSnap.exists()) {
                this.userone = docSnap.data();
                this.users2.push(this.userone)
                this.userone = null
            } else {
                // doc.data() がUndefinedの場合の処理
                console.log("No such document!");
            }
        }))
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
  },
  created() {
    this.showTodo();
    this.getAttendance()
  },
  data() {
    return {
      meeting: {title: "", describe: ""},
      allow: false,
      title_allow: false,
      describe_allow: false,
      date_allow: false,
      user_allow: false,
      title: "",
      selected_users: [],
      sl_users: [],
      remove_users: [],
      users: [],
      grade: null,
      classes: null,
      describe: "",
      time: null,
      meeting_users: [],
      userone: null,
      users2: [],
      userID: null,
    };
  },
};
</script>
