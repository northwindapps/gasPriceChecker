// firebaseGasStations.ts
import { db } from "../firebase";
import { collection, getDocs, addDoc, Timestamp, orderBy,QueryConstraint, query, Firestore} from "firebase/firestore";
import type { GasStation } from "../data/gasstations";


export async function getGasStationsFirebase(
  db: Firestore,
  sortField?: string,
  sortDirection: 'asc' | 'desc' = 'asc'
): Promise<GasStation[]> {
  const baseCollection = collection(db, "gasstations");

  const gasStationQuery = sortField
    ? query(baseCollection, orderBy(sortField, sortDirection))
    : baseCollection;

  const querySnapshot = await getDocs(gasStationQuery);

  return querySnapshot.docs.map((doc, index) => ({
    id: index + 1,
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