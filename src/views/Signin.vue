<template>
    <h1>sign in account</h1>
    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="text" placeholder="Password" v-model="password" /></p>
    <p><button @click="register">Submit</button></p>
</template>

<script>
import {getAuth, signInWithEmailAndPassword} from "firebase/auth"
export default {
    name: 'SigninView',
    methods:{
        register: function (){
            signInWithEmailAndPassword(getAuth(), this.email, this.password)
            .then((data) => {
                console.log("success! signin")
                this.$router.push("/")
            })
            .catch((error) => {
                console.log(error.code)
            })
        }
    },
    data() {
        return{
            email: "",
            password: ""
        }
    }
}
</script>