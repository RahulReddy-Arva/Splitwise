import { User as UserInterface, ValidationError } from '@/types'
import { ValidationUtils } from '@/lib/validation'

export class UserModel implements UserInterface {
  id: string
  email: string
  firstName: string
  lastName: string
  profilePicture?: string
  createdAt: Date
  updatedAt: Date

  constructor(data: Partial<UserInterface>) {
    this.id = data.id || ''
    this.email = data.email || ''
    this.firstName = data.firstName || ''
    this.lastName = data.lastName || ''
    this.profilePicture = data.profilePicture
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }

  validate(): ValidationError[] {
    const errors: ValidationError[] = []

    errors.push(...ValidationUtils.validateRequired(this.id, 'id'))
    errors.push(...ValidationUtils.validateEmail(this.email))
    errors.push(...ValidationUtils.validateRequired(this.firstName, 'firstName'))
    errors.push(...ValidationUtils.validateRequired(this.lastName, 'lastName'))
    errors.push(...ValidationUtils.validateDate(this.createdAt, 'createdAt'))
    errors.push(...ValidationUtils.validateDate(this.updatedAt, 'updatedAt'))

    return errors
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim()
  }

  get initials(): string {
    return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase()
  }

  toJSON(): UserInterface {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      profilePicture: this.profilePicture,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  static fromJSON(data: any): UserModel {
    return new UserModel({
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    })
  }
}