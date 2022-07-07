//importamos el defineStore
import { defineStore } from 'pinia';
import { auth, db, storage } from '../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import router from '../router';
import { useDatabaseStore } from './database';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore/lite';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

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
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('usuario creado');
        await sendEmailVerification(auth.currentUser);
        router.push('/login');
      } catch (error) {
        console.log(error.code);
        return error.code;
      } finally {
        this.loadingUser = false;
      }
    },

    async setUser(user) {
      try {
        const userInfo = {
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL,
          displayName: user.displayName,
        };

        const docRef = doc(db, 'users', user.uid);
        const docSpan = await getDoc(docRef);

        if (!docSpan.exists()) {
          // https://firebase.google.com/docs/firestore/manage-data/add-data?hl=es&authuser=0#add_a_document
          await setDoc(docRef, userInfo);
        }
      } catch (error) {
        console.log(error);
      }
    },

    // https://firebase.google.com/docs/auth/web/start?hl=es&authuser=0#sign_in_existing_users
    async loginUser(email, password) {
      this.loadingUser = true;
      try {
        let { user } = await signInWithEmailAndPassword(auth, email, password);
        // console.log(user);
        if (!user.emailVerified) {
          throw new Error('Usuario no verificado');
        }
        await this.setUser(user);
        // console.log(this.userData);
        await this.setUser(user);
        router.push('/');
      } catch (error) {
        console.log(error);
        return error.code;
      } finally {
        this.loadingUser = false;
      }
    },

    async logoutUser() {
      //reseteamos el store de los documentos
      const databaseStore = useDatabaseStore();
      databaseStore.$reset();
      try {
        router.push('/login');
        await signOut(auth);
      } catch (error) {
        console.log(error);
      }
    },
    // https://firebase.google.com/docs/auth/web/manage-users#update_a_users_profile
    async updateUser(displayName) {
      try {
        await updateProfile(auth.currentUser, {
          displayName,
        });
        const docRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(docRef, {
          displayName,
        });
      } catch (error) {
        console.log(error);
        return error.code;
      }
    },

    async updateImage(image) {
      try {
        console.log(image);
        // https://firebase.google.com/docs/storage/web/upload-files#upload_from_a_blob_or_file
        const profileRef = ref(storage, `profile/${auth.currentUser.uid}/perfil`);
        await uploadBytes(profileRef, image.originFileObj);

        //obtenemos la url
        const url = await getDownloadURL(profileRef);

        //actualizamos la foto del usuario
        await updateProfile(auth.currentUser, {
          photoURL: url,
        });

        const docRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(docRef, {
          photoURL: url,
        });
      } catch (error) {
        console.log(error);
        return error.code;
      }
    },

    //Nos trae la seccion activa del usuario
    currentUser() {
      return new Promise((resolve, reject) => {
        const unsuscribe = onAuthStateChanged(
          auth,
          async (user) => {
            // console.log(user);
            if (user) {
              // await this.setUser(user);
              this.userData = {
                email: user.email,
                uid: user.uid,
                photoURL: user.photoURL,
                displayName: user.displayName,
                emailVerified: user.emailVerified,
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
