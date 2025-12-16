export type Root = ClientObserver[]

export interface ClientObserver {
  id: number
  user: User
  user_profile: UserProfile
  create_date: string
  updated_date: string
  client: number
}

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_active: boolean
}

export interface UserProfile {
  id: number
  date_of_birth: string
  gender: string
  photo: string
  address: string
  phone: string
  city: string
  country: Country
  state: string
  created_at: string
  updated_at: string
  user: User2
  passport_number: string
}

export interface Country {
  code: string
  name: string
}

export interface User2 {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}
