<template>
  <nav>
    <router-link class="menutab" to="/new">New</router-link>
    <router-link class="menutab" to="/">Home</router-link>
    <router-link class="menutab" v-if="!(isLoggedIn)" to="/register">Register</router-link>
    <router-link class="menutab" v-if="!(isLoggedIn)" to="/signin">Signin</router-link>
    <button @click="handleSignOut" v-if="isLoggedIn" style="margin;:5px">SingOut</button>
    <!-- <p>{{ isLoggedIn }}</p>
    <p>{{ currentUser.uid }}</p> -->
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
import { onMounted, ref } from "vue"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { useRouter } from "vue-router"

const isLoggedIn = ref(false);
const router = useRouter();
let auth;
const currentUser = ref("");

onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if(user){
      isLoggedIn.value = true;
      currentUser.value = user
    }else{
      isLoggedIn.value = false;
    }
  })
})

const handleSignOut = () => {
  signOut(auth)
  currentUser.value = ""
}
</script>