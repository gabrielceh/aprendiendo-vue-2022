//importamos el defineStore
import { defineStore } from 'pinia';
import { auth } from '../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import router from '../router';
import { useDatabaseStore } from './database';

// creamos el store, le pasamos un nombre y los parametros
export const useUserStore = defineStore('userStore', {
  state: () => ({
    userData: null,
    loadingUser: false,
    loadingSesion: false,
  }),
  getters: {},
  actions: {
    // https://firebase.google.com/docs/auth/web/start?hl=es&authuser=0#sign_up_new_users
    async registerUser(email, password) {
      this.loadingUser = true;
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        console.log(user);
        this.userData = {
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL,
          displayName: user.displayName,
        };
        router.push('/');
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingUser = false;
      }
    },

    // https://firebase.google.com/docs/auth/web/start?hl=es&authuser=0#sign_in_existing_users
    async loginUser(email, password) {
      this.loadingUser = true;
      try {
        let { user } = await signInWithEmailAndPassword(auth, email, password);
        console.log(user);
        this.userData = {
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL,
          displayName: user.displayName,
        };
        router.push('/');
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingUser = false;
      }
    },

    async logoutUser() {
      //reseteamos el store de los documentos
      const databaseStore = useDatabaseStore();
      databaseStore.$reset();

      this.loadingUser = true;
      try {
        await signOut(auth);
        this.userData = null;
        router.push('/login');
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingUser = false;
      }
    },

    currentUser() {
      return new Promise((resolve, reject) => {
        const unsuscribe = onAuthStateChanged(
          auth,
          (user) => {
            if (user) {
              this.userData = {
                email: user.email,
                uid: user.uid,
                photoURL: user.photoURL,
                displayName: user.displayName,
              };
            } else {
              this.userData = null;
              const databaseStore = useDatabaseStore();
              databaseStore.$reset();
            }
            resolve(user);
          },
          (e) => reject(e)
        );
        unsuscribe();
      });
    },
  },
});
