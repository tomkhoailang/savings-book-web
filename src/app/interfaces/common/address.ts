import { z } from "zod"
export default interface Address {
  country?: string
  city?: string
  street?: string
  zipCode?: string
}

export const ZodAddress = z.object({
  country:  z.string(),
  city :  z.string(),
  street:  z.string(),
  zipCode:  z.string(),
})
