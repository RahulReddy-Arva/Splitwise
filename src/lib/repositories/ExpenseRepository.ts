import { BaseRepository } from './BaseRepository'
import { Expense } from '@/types'
import { localStorage } from '@/lib/storage'

export class ExpenseRepository extends BaseRepository<Expense> {
  constructor() {
    super('expenses')
  }

  async findByGroup(groupId: string): Promise<Expense[]> {
    return localStorage.getExpensesByGroup(groupId)
  }

  async findByPayer(userId: string): Promise<Expense[]> {
    const allExpenses = await this.findAll()
    return allExpenses.filter(expense => expense.paidBy === userId)
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Expense[]> {
    const allExpenses = await this.findAll()
    return allExpenses.filter(expense => 
      expense.date >= startDate && expense.date <= endDate
    )
  }

  async findByCategory(category: string): Promise<Expense[]> {
    const allExpenses = await this.findAll()
    return allExpenses.filter(expense => expense.category === category)
  }

  async getTotalByUser(userId: string): Promise<number> {
    const expenses = await this.findByPayer(userId)
    return expenses.reduce((total, expense) => total + expense.amount, 0)
  }

  async getRecentExpenses(limit = 10): Promise<Expense[]> {
    const allExpenses = await this.findAll()
    return allExpenses
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
  }
}