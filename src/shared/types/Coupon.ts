export type CouponStatus = "ACTIVE" | "EXPIRED" | "INACTIVE"

export interface User {
  id: number
}

export interface Coupon {
  id: number
  code: string
  discountPercent: number
  status: CouponStatus
  startDate: string
  endDate: string
  maxLimit: number
  isUserStatus: boolean
  userIds: User[]
}