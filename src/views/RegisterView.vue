<template>
    <h1>create account</h1>
    <p style="color: red;">{{ errorMessage }}</p>
    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="text" placeholder="Password" v-model="password" /></p>
    <p><button @click="registerST">Submit st</button></p>
    <p><button @click="registerTC">Submit tc</button></p>
    <p>{{ auth }}</p>
</template>

<script>
import {getAuth, createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth"
export default {
    name: 'RegisterView',
    methods:{
        mounted() {
            this.auth = getAuth()
            console.log("a")
        },
        async registerST(){
            try {
                const user = await createUserWithEmailAndPassword(getAuth(), this.email, this.password);
                await sendEmailVerification(getAuth().currentUser)
                console.log("success!")
                this.$router.push({name: 'registerSecondST', params: {email: this.email, password: this.password}})
            } catch (error) {
                console.log(error)
            }
        },
        async registerTC(){
            // this.$router.push({name: 'registerSecond', params: {email: this.email, password: this.password}})
            // createUserWithEmailAndPassword(getAuth(), this.email, this.password)
            // .then((data) => {
            //     console.log("success!")
            //     this.$router.push("/")
            // })
            // .catch((error) => {
            //     console.log(error.code)
            // })
            try {
                const user = await createUserWithEmailAndPassword(getAuth(), this.email, this.password);
                await sendEmailVerification(getAuth().currentUser)
                console.log("success!")
                this.$router.push({name: 'registerSecondTC', params: {email: this.email, password: this.password}})
            } catch (error) {
                if (error === "auth/user-not-found") {
                    this.errorMessage = "登録されていないメールアドレス又はパスワードが違います";
                } else if (error === "auth/wrong-password") {
                    this.errorMessage = "パスワードが違います";
                }
            }
        },
    },
    data() {
        return{
            email: "",
            password: "",
            store: null,
            auth: null,
            errorMessage: "",
        }
    }
}
</script>