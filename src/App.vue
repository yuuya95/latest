<template>
  <nav>
    <router-link class="menutab" v-if="isLoggedIn" to="/new">New</router-link>
    <router-link class="menutab" v-if="isLoggedIn" to="/">Home</router-link>
    <router-link class="menutab" v-if="isLoggedIn" to="/createQR">MyQR</router-link>
    <router-link class="menutab" v-if="!(isLoggedIn)" to="/register">Register</router-link>
    <router-link class="menutab" v-if="!(isLoggedIn)" to="/signin">SignIn</router-link>
    <button @click="handleSignOut" v-if="isLoggedIn" style="margin;:5px">SignOut</button>
    <p>{{ currentUserState }}</p>
  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>



<script setup>
import { onMounted, onUpdated ,ref } from "vue"
import {collection, doc, updateDoc, getDoc, onSnapshot, addDoc, query, orderBy, deleteDoc, setDoc} from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { useRouter } from "vue-router"
import { db } from "./firebase";
// import router from './router'


const isLoggedIn = ref(false);
const router = useRouter();
let auth;
const currentUser = ref("");
const currentUserState = ref("");

const getID = () => {
  return new Promise(resolve => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      // eslint-disable-next-line
      if(user == null){ 
        resolve([false, "a"]);
      }else{
        console.log(user)
        resolve([true, user.uid]);
      }
    })
  })
}

// var initFirebaseAuth = () => {
//   return new Promise((resolve) => {
//     var unsubscribe = firebase.auth().onAuthStateChanged((user) => {
//       // user オブジェクトを resolve
//       resolve(user);

//       // 登録解除
//       unsubscribe();
//     });
//   });
// };

onMounted(async() => {
  auth = getAuth();
  console.log(auth);
  onAuthStateChanged(auth, (user) => {
    if(user && user.emailVerified == true){
      isLoggedIn.value = true;
      currentUser.value = user;
    }else{
      isLoggedIn.value = false;
    }
  })
  console.log(currentUserState.value)
  const userID = await getID();
  if(userID[0]){
    const docRef = doc(db, "user", userID[1]);
    const docSnap = await getDoc(docRef);
    currentUserState.value = docSnap.data().state == "st";
    console.log(currentUserState.value)
  }
  console.log(userID[0])
  // const docRef = doc(db, "user", userID);
  // const docSnap = await getDoc(docRef);
  // currentUserState.value = docSnap.data().state == "st";
  // if(currentUserState.value != true && currentUserState.value != false){
    
  // }
})

// router.beforeEach((to, from, next) => {
//   console.log("a")
// })

const handleSignOut = () => {
  signOut(auth)
  currentUser.value = ""
  currentUserState.value = null
}
</script>