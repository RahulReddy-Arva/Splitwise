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