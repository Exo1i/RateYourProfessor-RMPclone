import {doc, getDoc, setDoc} from "firebase/firestore";
import {db} from "@/app/config/firebase";

export default async function updateViewCount(professorId) {

    const docRef = doc(db, "topSearched", professorId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        await setDoc(docRef, {clicks: docSnap.data().clicks + 1}, {merge: true});
    } else {
        await setDoc(docRef, {id: professorId, clicks: 1});
    }


}