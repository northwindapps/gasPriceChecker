import type { GridFilterModel, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { createGasStationFirebase } from "./firebaseGasStations";
type GasProductType = 'normal' | 'high' | 'other';

export interface GasStation {
  id: number;
  docId: string; 
  shopName: string;
  telephone: string;
  address: string;
  latitude: number;
  longitude: number;
  productType: GasProductType;
  updateDate: string; // ISO date string
  price: number; // Price in local currency units
}

const INITIAL_GASSTATIONS_STORE: GasStation[] = [];

export function getGasStationsStore(): GasStation[] {
  const stringified = localStorage.getItem('gasstations-store');
  return stringified ? JSON.parse(stringified) : INITIAL_GASSTATIONS_STORE;
}

export function setGasStationsStore(gasstations: GasStation[]) {
  return localStorage.setItem('gasstations-store', JSON.stringify(gasstations));
}

// export async function getMany({
//   paginationModel,
//   filterModel,
//   sortModel,
// }: {
//   paginationModel: GridPaginationModel;
//   sortModel: GridSortModel;
//   filterModel: GridFilterModel;
// }): Promise<{ items: GasStation[]; itemCount: number }> {
//   const store = getGasStationsStore();

//   let filtered = [...store];

//   // Apply filters
//   if (filterModel?.items?.length) {
//     filterModel.items.forEach(({ field, value, operator }) => {
//       if (!field || value == null) return;
//       filtered = filtered.filter((station) => {
//         const stationValue = station[field as keyof GasStation];
//         switch (operator) {
//           case 'contains':
//             return String(stationValue).toLowerCase().includes(String(value).toLowerCase());
//           case 'equals':
//             return stationValue === value;
//           case 'startsWith':
//             return String(stationValue).toLowerCase().startsWith(String(value).toLowerCase());
//           case 'endsWith':
//             return String(stationValue).toLowerCase().endsWith(String(value).toLowerCase());
//           case '>':
//             return stationValue > value;
//           case '<':
//             return stationValue < value;
//           default:
//             return true;
//         }
//       });
//     });
//   }

//   // Apply sorting
//   if (sortModel?.length) {
//     filtered.sort((a, b) => {
//       for (const { field, sort } of sortModel) {
//         if (a[field as keyof GasStation] < b[field as keyof GasStation]) {
//           return sort === 'asc' ? -1 : 1;
//         }
//         if (a[field as keyof GasStation] > b[field as keyof GasStation]) {
//           return sort === 'asc' ? 1 : -1;
//         }
//       }
//       return 0;
//     });
//   }

//   // Apply pagination
//   const start = paginationModel.page * paginationModel.pageSize;
//   const end = start + paginationModel.pageSize;
//   const paginated = filtered.slice(start, end);

//   return {
//     items: paginated,
//     itemCount: filtered.length,
//   };
// }

export async function getOne(gasStationId: number) {
  const store = getGasStationsStore();
  const found = store.find((station) => station.id === gasStationId);
  if (!found) throw new Error('Gas station not found');
  return found;
}

export async function createOne(gasStation: Omit<GasStation, "id">) {
  return await createGasStationFirebase(gasStation);
}

export async function updateOne(
  gasStationId: number,
  data: Partial<Omit<GasStation, 'id' | 'updateDate'>>
) {
  const store = getGasStationsStore();
  let updated: GasStation | null = null;
  setGasStationsStore(
    store.map((station) => {
      if (station.id === gasStationId) {
        updated = { ...station, ...data, updateDate: new Date().toISOString() };
        return updated;
      }
      return station;
    }),
  );
  if (!updated) throw new Error('Gas station not found');
  return updated;
}

export async function deleteOne(gasStationId: number) {
  const store = getGasStationsStore();
  setGasStationsStore(store.filter((station) => station.id !== gasStationId));
}

// Validation
type ValidationResult = { issues: { message: string; path: (keyof GasStation)[] }[] };

export function validate(gasStation: Partial<GasStation>): ValidationResult {
  let issues: ValidationResult['issues'] = [];
  //optional
  // if (!gasStation.shopName) {
  //   issues.push({ message: 'Shop name is required', path: ['shopName'] });
  // }
  if (!gasStation.telephone) {
    issues.push({ message: 'Telephone is required', path: ['telephone'] });
  }
  //optional
  // if (!gasStation.address) {
  //   issues.push({ message: 'Address is required', path: ['address'] });
  // }
  if (gasStation.latitude == null) {
    issues.push({ message: 'Latitude is required', path: ['latitude'] });
  }
  if (gasStation.longitude == null) {
    issues.push({ message: 'Longitude is required', path: ['longitude'] });
  }
  if (!gasStation.productType) {
    issues.push({ message: 'Product type is required', path: ['productType'] });
  } else if (!['normal', 'high', 'other'].includes(gasStation.productType)) {
    issues.push({ message: 'Product type must be "normal", "high", or "other"', path: ['productType'] });
  }
  if (gasStation.price == null) {
    issues.push({ message: 'Price is required', path: ['price'] });
  } else if (typeof gasStation.price !== 'number' || gasStation.price < 0) {
    issues.push({ message: 'Price must be a positive number', path: ['price'] });
  }

  return { issues };
}
