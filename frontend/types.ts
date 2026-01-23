
export interface Jurisdiction {
  territorial: string;
  pecuniary: string;
}

export interface PetitionerInfo {
  name: string;
  address: string;
  age: number;
  aadhaarNumber: string;
}

export interface RespondentInfo {
  name: string;
  address: string;
}

export interface LegalDraftRequest {
  petitioner: PetitionerInfo;
  respondent: RespondentInfo;
  jurisdiction: Jurisdiction;
  causeOfAction: string;
  petitionType: 'Civil' | 'Criminal' | 'Writ' | 'Consumer';
}

export interface LegalDraftResponse {
  formattedDraft: string;
  references: string[];
}

export interface User {
  name: string;
  email: string;
  photo?: string;
}

