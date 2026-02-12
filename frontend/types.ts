
export interface Jurisdiction {
  territorial: string;
  pecuniary: string;
}

export interface PetitionerInfo {
  name: string;
  address: string;
  age: number;
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
  id: string;
  name: string;
  email: string;
  photo?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  address: string;
  phone: string;
  age: number;
  jurisdiction: string;
  avatar_url: string;
}
