export const MILES_PER_KM = 0.621371;
export const KM_PER_MILE = 1.609344;

export function kmToMiles(km: number): number {
  return km * MILES_PER_KM;
}

export function milesToKm(miles: number): number {
  return miles * KM_PER_MILE;
}
