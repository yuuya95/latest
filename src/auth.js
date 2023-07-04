import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"

const getIsAuth = () => {
    let isLoggedIn = ""
    let currentUser = null
    onAuthStateChanged(getAuth(), (user) => {
        if(user && user.emailVerified == true){
            isLoggedIn = true;
            console.log("a")
            currentUser = user
        }else{
            console.log("b")
            isLoggedIn = "a";
        }
    })
    return [isLoggedIn, currentUser]
}

export default getIsAuth