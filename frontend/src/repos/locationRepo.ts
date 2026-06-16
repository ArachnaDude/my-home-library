import { apiRequest } from "../api/client";
import type { Location, LocationCreate } from "../types/location";

export const locationRepo = {
  getAll(): Promise<Location[]> {
    return apiRequest<Location[]>("/locations");
  },

  create(data: LocationCreate): Promise<Location> {
    return apiRequest<Location>("/locations/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
