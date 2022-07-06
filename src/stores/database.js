import { defineStore } from 'pinia';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
} from 'firebase/firestore/lite';
import { db, auth } from '../firebaseConfig';
import { nanoid } from 'nanoid';
import router from '../router';

export const useDatabaseStore = defineStore('database', {
  state: () => ({
    documents: [],
    loading: false,
    loadingDocs: false,
  }),
  getters: {
    getUrlsList: async (state) => await state.documents,
  },
  actions: {
    // https://firebase.google.com/docs/firestore/query-data/get-data?hl=es&authuser=0#get_multiple_documents_from_a_collection
    async getUrls() {
      if (this.documents.length !== 0) {
        return;
      }

      this.loadingDocs = true;
      try {
        // creamos busqueda de los elemenytos
        const q = query(collection(db, 'urls'), where('user', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // console.log(doc.id, doc.data());
          this.documents.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingDocs = false;
      }
    },

    // https://firebase.google.com/docs/firestore/manage-data/add-data?hl=es&authuser=0#add_a_document
    async addUrl(name) {
      this.loading = true;
      try {
        const objetoDoc = {
          name,
          short: nanoid(10),
          user: auth.currentUser.uid,
        };
        const docRef = await addDoc(collection(db, 'urls'), objetoDoc);
        // console.log(docRef);
        this.documents.push({ id: docRef.id, ...objetoDoc });
      } catch (error) {
        console.log(error.code);
        return error.code;
      } finally {
        this.loading = false;
      }
    },
    // https://firebase.google.com/docs/firestore/manage-data/delete-data?hl=es&authuser=0#delete_documents
    async deleteUrl(id) {
      this.loading = true;
      try {
        console.log(id);
        const docRef = doc(db, 'urls', id);
        // https://firebase.google.com/docs/firestore/query-data/get-data?hl=es&authuser=0#get_a_document
        const docSearch = await getDoc(docRef);
        if (!docSearch.exists()) {
          throw new Error('No existe el documento');
        }

        if (docSearch.data().user !== auth.currentUser.uid) {
          throw new Error('usuario no autorizado');
        }

        await deleteDoc(docRef);
        this.documents = this.documents.filter((item) => item.id !== id);
      } catch (error) {
        console.log(error);
        return error.message;
      } finally {
        this.loading = false;
      }
    },

    async readUrl(id) {
      this.loading = true;
      try {
        const docRef = doc(db, 'urls', id);
        // https://firebase.google.com/docs/firestore/query-data/get-data?hl=es&authuser=0#get_a_document
        const docSearch = await getDoc(docRef);

        if (!docSearch.exists()) {
          throw new Error('No existe el documento');
        }

        if (docSearch.data().user !== auth.currentUser.uid) {
          throw new Error('usuario no autorizado');
        }

        return docSearch.data().name;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    // https://firebase.google.com/docs/firestore/manage-data/add-data?hl=es&authuser=0#update-data
    async editUrl(id, name) {
      this.loading = true;
      try {
        const docRef = doc(db, 'urls', id);
        // https://firebase.google.com/docs/firestore/query-data/get-data?hl=es&authuser=0#get_a_document
        const docSearch = await getDoc(docRef);

        if (!docSearch.exists()) {
          throw new Error('No existe el documento');
        }

        if (docSearch.data().user !== auth.currentUser.uid) {
          throw new Error('usuario no autorizado');
        }

        await updateDoc(docRef, {
          name,
        });

        this.documents = this.documents.map((item) =>
          item.id === id ? { ...item, name: name } : item
        );
        router.push('/');
        router;
      } catch (error) {
        console.log(error);
        return error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
