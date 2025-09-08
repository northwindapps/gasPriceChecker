// firebaseGasStations.ts
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import type { GasStation } from "../data/gasstations";

export async function getGasStationsFirebase(): Promise<GasStation[]> {
  const querySnapshot = await getDocs(collection(db, "gasstations"));
  return querySnapshot.docs.map((doc,index) => ({
    id: index + 1, // Firestore docs don't have a numeric ID by default
    ...doc.data(),
  } as GasStation));
}
