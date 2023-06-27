<template>
    <h1>create account</h1>
    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="text" placeholder="Password" v-model="password" /></p>
    <p><button @click="register">Submit</button></p>
</template>

<script>
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth"
export default {
    name: 'RegisterSecondTCView',
    methods:{
        register: function (){
            createUserWithEmailAndPassword(getAuth(), this.email, this.password)
            .then((data) => {
                console.log("success!")
                this.$router.push("/")
            })
            .catch((error) => {
                console.log(error.code)
            })
        },
    },
    data() {
        return{
            email: "",
            password: ""
        }
    }
}
</script>