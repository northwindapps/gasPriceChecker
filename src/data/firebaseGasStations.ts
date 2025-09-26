// firebaseGasStations.ts
import { db } from "../firebase";
import { collection, getDocs, addDoc, Timestamp, orderBy, query, where, Firestore} from "firebase/firestore";
import type { GasStation } from "../data/gasstations";

export async function getGasStationsFirebase(
  db: Firestore,
  sortField?: string,
  sortDirection: 'asc' | 'desc' = 'asc',
  filterModel?: any
): Promise<GasStation[]> {
  const baseCollection = collection(db, "gasstations");

  const constraints: any[] = [];

  // add filter constraints if present
  if (filterModel?.items?.length > 0) {
    filterModel.items.forEach((item: any) => {
      if (item.value !== undefined && item.value !== null && item.value !== "") {
        let filterValue: any = item.value;

        // try to cast to number if the field is numeric
        if (item.field === "price") {
          const num = Number(item.value);
          if (!isNaN(num)) {
            filterValue = num;
          }
        }

        switch (item.operator) {
          case "equals":
            constraints.push(where(item.field, "==", filterValue));
            break;
          case "greaterThan":
            constraints.push(where(item.field, ">", filterValue));
            break;
          case "lessThan":
            constraints.push(where(item.field, "<", filterValue));
            break;
        }
      }
    });
  }

  // add sort if needed
  if (sortField) {
    constraints.push(orderBy(sortField, sortDirection));
  }

  const gasStationQuery = constraints.length > 0
    ? query(baseCollection, ...constraints)
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