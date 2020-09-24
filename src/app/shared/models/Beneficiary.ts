
export interface BeneficiaryType {
  id: number,
  name: string
}

export interface BeneficiaryRelationship {
  id: number,
  name: string
}

export interface Beneficiary {
  fullName: string,
  birthday: string | number,
  type: BeneficiaryType,
  optional: string,
  relationship: BeneficiaryRelationship,
  percentage: number,
  beneficiarySubmitted: boolean
}