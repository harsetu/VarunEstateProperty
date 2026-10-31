import type { PropertyRepository } from '@/domain/repositories/PropertyRepository';
import type { DataSource } from '@/flavors/types';

type Static = Extract<DataSource, { kind: 'static' }>;

export class StaticPropertyRepository implements PropertyRepository {
  constructor(private readonly data: Static) {}

  getAll = async () => this.data.properties;
  getById = async (id: string) => this.data.properties.find((p) => p.id === id);
  getNearby = async (p: Parameters<PropertyRepository['getNearby']>[0]) =>
    p.nearby ?? this.data.nearbyBySector[p.sector] ?? [];
  getNewProjects = async () => this.data.newProjects;
}
