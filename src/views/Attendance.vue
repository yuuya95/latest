<template>
    <div class="meeting">
        <p><router-link :to="{ name: 'oneMeeting', params: { id: this.$route.params.id }}">戻る</router-link></p>
        <div v-for="(user, key) in users" :key="key">
            <div style="padding: 10px;">
                <p>{{ user.grade }}, {{ user.classes }}, {{ user.num }}, {{ user.name }}</p>
                <p v-if="user.isAttende">○</p>
                <p v-else>×</p>
                <div v-if="user.isAttende">{{ user.firstTime }}, {{ user.lastTime }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    collection,
    doc,
    updateDoc,
    getDocs,
    getDoc,
    onSnapshot,
    addDoc,
    query,
    orderBy,
    deleteDoc,
    setDoc,
    where,
} from "firebase/firestore";
import { db } from "../firebase";
import { nullLiteral } from "@babel/types";
export default {
    name: "AttendanceView",
    methods: {
        async getAttendance(){
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
                    console.log("Document data:", docSnap.data());
                    this.user.grade = docSnap.data().grade;
                    this.user.classes = docSnap.data().classes;
                    this.user.num = docSnap.data().num;
                    this.user.name = docSnap.data().name;
                    this.user.firstTime = meeting_user.firstTime;
                    this.user.lastTime = meeting_user.lastTime;
                    this.user.isAttende = this.user.firstTime != null || this.user.lastTime != null;
                    console.log(this.user.firstTime != null);
                    console.log("Document data:", this.user);
                    this.users.push(this.user);
                    this.user = {
                        grade: null,
                        classes: null,
                        num: null,
                        name: null,
                        firstTime: null,
                        lastTime: null,
                        isAttende: false,
                    }
                } else {
                    // doc.data() がUndefinedの場合の処理
                    console.log("No such document!");
                }
            }))
        }
    },
    created() {
        this.getAttendance()
    },
    data() {
        return {
            meeting_users: [],
            users: [],
            user: {
                grade: null,
                classes: null,
                num: null,
                name: null,
                firstTime: null,
                lastTime: null,
                isAttende: false,
            }
        };
    },
};
</script>