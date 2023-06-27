<template>
    <h1>create account</h1>
    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="text" placeholder="Password" v-model="password" /></p>
    <p><button @click="registerST">Submit st</button></p>
    <p><button @click="registerTC">Submit tc</button></p>
</template>

<script>
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth"
export default {
    name: 'RegisterView',
    methods:{
        registerST: function (){
            createUserWithEmailAndPassword(getAuth(), this.email, this.password)
            .then((data) => {
                console.log("success!")
                this.$router.push({name: 'registerSecondST', params: {email: this.email, password: this.password}})
            })
            .catch((error) => {
                console.log(error.code)
            })
        },
        registerTC: function (){
            // this.$router.push({name: 'registerSecond', params: {email: this.email, password: this.password}})
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