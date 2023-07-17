import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import {collection, doc, updateDoc, getDoc, onSnapshot, addDoc, query, orderBy, deleteDoc, setDoc} from "firebase/firestore";
import { db } from "../firebase";
import {Promise} from 'core-js';
import NewTCView from '../views/NewTCView.vue'
import MeetingView from "../views/MeetingView.vue"
import HomeView from '../views/HomeView.vue'
import QRFirstView from "../views/QRFirstView.vue"
import QRLastView from "../views/QRLastView.vue"
import AttendanceView from "../views/Attendance.vue"
import ChooseView from "../views/ChooseView.vue"
import RegisterView from "../views/RegisterView.vue"
import RegisterSecondSTView from "../views/RegisterSecondSTView.vue"
import RegisterSecondTCView from "../views/RegisterSecondTCView.vue"
import SigninView from "../views/Signin.vue"
import CreateQRView from "../views/CreateQRView"
import { getRandomValues } from 'crypto';

// import getIsAuth from "../auth"
// import { reject, resolve } from 'core-js/fn/promise'

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      requiresAuth: true,
      tc: true
    }
  },
  {
    path: "/new",
    name: "newTC",
    component: NewTCView,
    meta: {
      requiresAuth: true,
      tc: true
    }
  },
  {
    path: "/choose/:id",
    name: "choose",
    component: ChooseView,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/meeting/:id",
    name: "oneMeeting",
    component: MeetingView,
    meta: {
      requiresAuth: true,
      tc: true
    }
  },
  {
    path: "/qrFirst/:id",
    name: "QRreaderFirst",
    component: QRFirstView,
    meta: {
      requiresAuth: true,
      tc: true
    }
  },
  {
    path: "/qrLast/:id",
    name: "QRreaderLast",
    component: QRLastView,
    meta: {
      requiresAuth: true,
      tc: true
    }
  },
  {
    path: "/createQR",
    name: "CreateQR",
    component: CreateQRView,
    meta: {
      requiresAuth: true,
      st: true
    }
  },
  {
    path: "/attendance/:id",
    name: "attendance",
    component: AttendanceView,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
    meta: {
      register: true,
    }
  },
  {
    path: "/registersecondST/:email",
    name: "registerSecondST",
    component: RegisterSecondSTView,
  },
  {
    path: "/registersecondTC/:email/:password",
    name: "registerSecondTC",
    component: RegisterSecondTCView,
  },
  {
    path: "/signin",
    name: "signin",
    component: SigninView,
  },
  
]

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    )
  })
}




const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

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
// router.beforeEach(async(to, from, next) => {
//   if(to.matched.some((record) => record.meta.requiresAuth)){
//     const a = await getCurrentUser()
//     if(a){
//       console.log()
//       next();
//     }else{
//       console.log("you dont have token");
//       next("/register");
//     }
//   }else{
//     next();
//   }
// });


router.beforeEach((to, from, next) => {
  if(to.matched.some((record) => record.meta.requiresAuth)){
    onAuthStateChanged(getAuth(), (user) => {
      if(user && user.emailVerified === true){
        next();
      }else{
        next("/register");
      }
    })
  }else{
    next()
  }
})

router.beforeEach(async (to, from, next) => {
  if(to.matched.some((record) => record.meta.tc)){
    const userID = await getID();
    var currentUserState = false
    if(userID[0]){
      const docRef = doc(db, "user", userID[1]);
      const docSnap = await getDoc(docRef);
      currentUserState = docSnap.data().state !== "st";
      console.log(currentUserState)
    }
    if(currentUserState){
      next()
    }else{
      next("/createQR")
    }
  }else{
    next()
  }
})

export default router
