export interface IBranch {
  _id?: string;
  name: string;
  address1: string;
  address2?: string;
  address3?: string;
  city: string;
  country: string;
  state: string;
  fqdn?: string;
  branchCode: string;
}
