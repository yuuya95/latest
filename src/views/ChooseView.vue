<template>
    <div class="choose">
    </div>
</template>

<script>
import {collection, doc, updateDoc, getDocs, onSnapshot, addDoc, query, orderBy, deleteDoc, setDoc} from "firebase/firestore";
import { db } from "../firebase";
export default{
    name: "ChooseView",
    methods: {
        async showTodo(){
            const q = query(collection(db, "todo"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const obj = {id: doc.id}
                let allObj = Object.assign(obj, doc.data());
                this.todos.push(allObj)
            });
        },
    },
    mounted(){
        this.showTodo();
    }, 
    data() {
        return{
            todos: [],
            title: "",
        }
    }
}
</script>
