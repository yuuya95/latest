<template>
    <div class="home">
        <h1>作成したミーティング</h1>
        <div v-for="(meeting, key) in meetings" :key="key" style="padding: 30px;">
            <router-link :to="{ name: 'oneMeeting', params: { id: meeting.id }}">{{ meeting.title }}</router-link>
            <p>{{ meeting.describe }}</p>
        </div>
    </div>
</template>

<script>
import {collection, doc, updateDoc, getDocs, onSnapshot, addDoc, query, orderBy, deleteDoc, setDoc} from "firebase/firestore";
import { db } from "../firebase";
export default{
    name: "HomeView",
    methods: {
        async showTodo(){
            const q = query(collection(db, "meeting"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const obj = {id: doc.id}
                let allObj = Object.assign(obj, doc.data());
                this.meetings.push(allObj)
            });
        },
    },
    mounted(){
        this.showTodo();
    }, 
    data() {
        return{
            meetings: [],
            title: "",
        }
    }
}
</script>
