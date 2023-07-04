<template>
    <h1>create account</h1>
    <p><input type="text" placeholder="名前" v-model="name" /></p>
    <p><select v-model="grade" id="grade">
        <option value="" disabled selected style="display:none;">学年を選択</option>
        <option value=1>中学1年</option>
        <option value=2>中学2年</option>
        <option value=3>中学3年</option>
        <option value=4>高校1年</option>
        <option value=5>高校2年</option>
        <option value=6>高校3年</option>
    </select></p>
    <p><button @click="register">Submit</button></p>
</template>

<script>
import {getAuth, createUserWithEmailAndPassword, onAuthStateChanged} from "firebase/auth"
import {collection, doc, updateDoc, getDocs, onSnapshot, addDoc, query, orderBy, deleteDoc, setDoc} from "firebase/firestore";
import { db } from "../firebase";
export default {
    name: 'RegisterSecondTCView',
    methods:{
        async createUser(){
            const data = {
                name: this.name,
                grade: this.grade,
                state: "tc"
            }
            const docRef = doc(db, "user", this.currentUser.uid);
            await setDoc(docRef, data);
        },
        register: function(){
            console.log(this.data)
            this.createUser()
            this.$router.push("/")
            alert("メールアドレスの認証を行ってください")
        }
    },
    mounted : function(){
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if(user){
                this.currentUser = user
            }
        })
    },
    data() {
        return{
            name: "",
            grade: "",
            currentuser: "",
        }
    }
}
</script>