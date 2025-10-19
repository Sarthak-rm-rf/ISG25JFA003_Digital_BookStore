export interface Address {
  addressId: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  country: string;
  fullName: string;
  phone: string;
  postalCode: string;
  state: string;
}
