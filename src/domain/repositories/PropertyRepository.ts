import type { NearbyPlace, NewProject, Property } from '../property';

/** Contract the app depends on. Implementations live in the data layer. */
export interface PropertyRepository {
  getAll(): Promise<Property[]>;
  getById(id: string): Promise<Property | undefined>;
  getNearby(property: Property): Promise<NearbyPlace[]>;
  getNewProjects(): Promise<NewProject[]>;
}
