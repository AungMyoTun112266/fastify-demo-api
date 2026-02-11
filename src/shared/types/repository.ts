export interface Repository<T> {
  save(entity: T): Promise<T>;
  findById(id: string): Promise<T | null>;
}

export interface ListableRepository<T> extends Repository<T> {
  findAll(): Promise<T[]>;
}
