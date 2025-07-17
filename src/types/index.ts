// Core data types for the Splitwise app
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  profilePicture?: string
  createdAt: Date
  updatedAt: Date
}

export interface Expense {
  id: string
  description: string
  amount: number
  currency: string
  date: Date
  category: ExpenseCategory
  groupId?: string
  paidBy: string
  splits: ExpenseSplit[]
  receiptUrl?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface ExpenseSplit {
  userId: string
  amount: number
  percentage?: number
  shares?: number
}

export interface Group {
  id: string
  name: string
  description?: string
  type: GroupType
  members: GroupMember[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface GroupMember {
  userId: string
  role: 'admin' | 'member'
  joinedAt: Date
}

export interface Balance {
  id: string
  groupId?: string
  fromUser: string
  toUser: string
  amount: number
  currency: string
  lastUpdated: Date
}

export interface Payment {
  id: string
  fromUser: string
  toUser: string
  amount: number
  currency: string
  method: PaymentMethod
  status: PaymentStatus
  createdAt: Date
  settledAt?: Date
}

// Request/Response types for API
export interface ExpenseRequest {
  description: string
  amount: number
  currency: string
  date: Date
  category: ExpenseCategory
  groupId?: string
  paidBy: string
  splits: ExpenseSplitRequest[]
  notes?: string
}

export interface ExpenseSplitRequest {
  userId: string
  splitType: SplitType
  amount?: number
  percentage?: number
  shares?: number
}

export interface GroupRequest {
  name: string
  description?: string
  type: GroupType
}

export interface PaymentRequest {
  fromUser: string
  toUser: string
  amount: number
  currency: string
  method: PaymentMethod
  groupId?: string
}

export interface Settlement {
  id: string
  fromUser: string
  toUser: string
  amount: number
  currency: string
  groupId?: string
}

// Enums and types
export type ExpenseCategory = 
  | 'food'
  | 'transport'
  | 'accommodation'
  | 'entertainment'
  | 'utilities'
  | 'shopping'
  | 'healthcare'
  | 'other'

export type GroupType = 'trip' | 'home' | 'couple' | 'other'

export type PaymentMethod = 'venmo' | 'paypal' | 'apple_pay' | 'cash' | 'other'

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled'

export type SplitType = 'equal' | 'exact' | 'percentage' | 'shares'

// Validation error types
export interface ValidationError {
  field: string
  message: string
}

export interface ApiError {
  message: string
  code: string
  details?: any
}