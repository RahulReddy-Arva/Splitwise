// Local storage abstraction for offline functionality
import { User, Expense, Group, Balance, Payment } from '@/types'

export interface StorageEntity {
  id: string
  createdAt: Date
  updatedAt: Date
  syncStatus: 'synced' | 'pending' | 'conflict'
}

export class LocalStorage {
  private dbName = 'splitwise-db'
  private version = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' })
          userStore.createIndex('email', 'email', { unique: true })
        }

        if (!db.objectStoreNames.contains('expenses')) {
          const expenseStore = db.createObjectStore('expenses', { keyPath: 'id' })
          expenseStore.createIndex('groupId', 'groupId', { unique: false })
          expenseStore.createIndex('paidBy', 'paidBy', { unique: false })
          expenseStore.createIndex('date', 'date', { unique: false })
        }

        if (!db.objectStoreNames.contains('groups')) {
          const groupStore = db.createObjectStore('groups', { keyPath: 'id' })
          groupStore.createIndex('createdBy', 'createdBy', { unique: false })
        }

        if (!db.objectStoreNames.contains('balances')) {
          const balanceStore = db.createObjectStore('balances', { keyPath: 'id' })
          balanceStore.createIndex('groupId', 'groupId', { unique: false })
          balanceStore.createIndex('fromUser', 'fromUser', { unique: false })
          balanceStore.createIndex('toUser', 'toUser', { unique: false })
        }

        if (!db.objectStoreNames.contains('payments')) {
          const paymentStore = db.createObjectStore('payments', { keyPath: 'id' })
          paymentStore.createIndex('fromUser', 'fromUser', { unique: false })
          balanceStore.createIndex('toUser', 'toUser', { unique: false })
        }

        if (!db.objectStoreNames.contains('sync_queue')) {
          db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true })
        }
      }
    })
  }

  private async getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    if (!this.db) {
      await this.init()
    }
    const transaction = this.db!.transaction([storeName], mode)
    return transaction.objectStore(storeName)
  }

  // Generic CRUD operations
  async create<T extends StorageEntity>(storeName: string, data: T): Promise<T> {
    const store = await this.getStore(storeName, 'readwrite')
    const entityWithMeta = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      syncStatus: 'pending' as const,
    }
    
    return new Promise((resolve, reject) => {
      const request = store.add(entityWithMeta)
      request.onsuccess = () => resolve(entityWithMeta)
      request.onerror = () => reject(request.error)
    })
  }

  async read<T>(storeName: string, id: string): Promise<T | null> {
    const store = await this.getStore(storeName)
    
    return new Promise((resolve, reject) => {
      const request = store.get(id)
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  async readAll<T>(storeName: string): Promise<T[]> {
    const store = await this.getStore(storeName)
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async update<T extends StorageEntity>(storeName: string, data: T): Promise<T> {
    const store = await this.getStore(storeName, 'readwrite')
    const updatedData = {
      ...data,
      updatedAt: new Date(),
      syncStatus: 'pending' as const,
    }
    
    return new Promise((resolve, reject) => {
      const request = store.put(updatedData)
      request.onsuccess = () => resolve(updatedData)
      request.onerror = () => reject(request.error)
    })
  }

  async delete(storeName: string, id: string): Promise<void> {
    const store = await this.getStore(storeName, 'readwrite')
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // Specialized queries
  async getExpensesByGroup(groupId: string): Promise<Expense[]> {
    const store = await this.getStore('expenses')
    const index = store.index('groupId')
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(groupId)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getBalancesByUser(userId: string): Promise<Balance[]> {
    const store = await this.getStore('balances')
    const results: Balance[] = []
    
    // Get balances where user is the debtor
    const fromIndex = store.index('fromUser')
    const fromRequest = fromIndex.getAll(userId)
    
    // Get balances where user is the creditor
    const toIndex = store.index('toUser')
    const toRequest = toIndex.getAll(userId)
    
    return new Promise((resolve, reject) => {
      let completed = 0
      
      fromRequest.onsuccess = () => {
        results.push(...fromRequest.result)
        if (++completed === 2) resolve(results)
      }
      
      toRequest.onsuccess = () => {
        results.push(...toRequest.result)
        if (++completed === 2) resolve(results)
      }
      
      fromRequest.onerror = toRequest.onerror = () => reject(fromRequest.error || toRequest.error)
    })
  }

  // Sync queue operations
  async addToSyncQueue(operation: 'create' | 'update' | 'delete', entity: string, data: any): Promise<void> {
    const store = await this.getStore('sync_queue', 'readwrite')
    const queueItem = {
      operation,
      entity,
      data,
      timestamp: new Date(),
    }
    
    return new Promise((resolve, reject) => {
      const request = store.add(queueItem)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getSyncQueue(): Promise<any[]> {
    const store = await this.getStore('sync_queue')
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async clearSyncQueue(): Promise<void> {
    const store = await this.getStore('sync_queue', 'readwrite')
    
    return new Promise((resolve, reject) => {
      const request = store.clear()
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

// Singleton instance
export const localStorage = new LocalStorage()