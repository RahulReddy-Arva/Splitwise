import { localStorage, StorageEntity } from '@/lib/storage'

export abstract class BaseRepository<T extends StorageEntity> {
  protected storeName: string

  constructor(storeName: string) {
    this.storeName = storeName
  }

  async create(data: Omit<T, 'createdAt' | 'updatedAt' | 'syncStatus'>): Promise<T> {
    const entity = {
      ...data,
      id: data.id || this.generateId(),
    } as T

    const result = await localStorage.create(this.storeName, entity)
    await localStorage.addToSyncQueue('create', this.storeName, result)
    return result
  }

  async findById(id: string): Promise<T | null> {
    return localStorage.read<T>(this.storeName, id)
  }

  async findAll(): Promise<T[]> {
    return localStorage.readAll<T>(this.storeName)
  }

  async update(data: T): Promise<T> {
    const result = await localStorage.update(this.storeName, data)
    await localStorage.addToSyncQueue('update', this.storeName, result)
    return result
  }

  async delete(id: string): Promise<void> {
    await localStorage.delete(this.storeName, id)
    await localStorage.addToSyncQueue('delete', this.storeName, { id })
  }

  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}