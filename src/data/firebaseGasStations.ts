// firebaseGasStations.ts
import { db } from "../firebase";
import { collection, getDocs, addDoc, Timestamp} from "firebase/firestore";
import type { GasStation } from "../data/gasstations";

export async function getGasStationsFirebase(): Promise<GasStation[]> {
  const querySnapshot = await getDocs(collection(db, "gasstations"));
  return querySnapshot.docs.map((doc,index) => ({
    id: index + 1, // Firestore docs don't have a numeric ID by default
    docId: doc.id, 
    ...doc.data(),
  } as GasStation));
}

export async function createGasStationFirebase(
  gasStation: Omit<GasStation, "id">
): Promise<void> {
  await addDoc(collection(db, "gasstations"), {
    ...gasStation,
    createdAt: Timestamp.now(), // optional field for tracking
  });
}