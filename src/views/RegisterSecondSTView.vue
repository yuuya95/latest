<template>
    <h1>create account</h1>
    <p><input type="text" placeholder="名前" v-model="name" /></p>
    <p><input type="number" placeholder="年" v-model="grade" /></p>
    <p><input type="number" placeholder="組" v-model="classes" /></p>
    <p><input type="number" placeholder="番号" v-model="num" /></p>
    <p><button @click="register">Submit</button></p>
</template>

<script>
import {getAuth, createUserWithEmailAndPassword, onAuthStateChanged} from "firebase/auth"
import {collection, doc, updateDoc, getDocs, onSnapshot, addDoc, query, orderBy, deleteDoc, setDoc} from "firebase/firestore";
import { db } from "../firebase";
export default {
    name: 'RegisterSecondSTView',
    methods:{
        async createUser(){
            const data = {
                name: this.name,
                grade: this.grade,
                classes: this.classes,
                num: this.num,
                email: this.$route.params.email,
                state: "st"
            }
            const docRef = doc(db, "user", this.currentUser.uid);
            await setDoc(docRef, data);
        },
        register: function(){
            console.log(this.data)
            this.createUser()
            this.$router.push("/")
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
            num: "",
            classes: "",
            grade: "",
            currentUser: "",
        }
    }
}
</script>