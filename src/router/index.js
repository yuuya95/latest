import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from "firebase/auth"
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
// import { reject, resolve } from 'core-js/fn/promise'

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/new",
    name: "newTC",
    component: NewTCView,
    meta: {
      requiresAuth: true,
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
    }
  },
  {
    path: "/qrFirst/:id",
    name: "QRreaderFirst",
    component: QRFirstView,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/qrLast/:id",
    name: "QRreaderLast",
    component: QRLastView,
    meta: {
      requiresAuth: true,
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

router.beforeEach(async(to, from, next) => {
  if(to.matched.some((record) => record.meta.requiresAuth)){
    if(await getCurrentUser()){
      next();
    }else{
      console.log("you dont have token");
      next("/register");
    }
  }else{
    next();
  }
});

export default router
