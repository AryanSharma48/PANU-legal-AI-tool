
export interface Jurisdiction {
  territorial: string;
  pecuniary: string;
}

export interface PetitionerInfo {
  name: string;
  parentOrSpouseName?: string;
  address: string;
  age: number;
}

export interface RespondentInfo {
  name: string;
  parentOrSpouseName?: string;
  address: string;
}

export interface LegalDraftRequest {
  petitioner: PetitionerInfo;
  respondent: RespondentInfo;
  jurisdiction: Jurisdiction;
  causeOfAction: string;
  petitionType: 'Civil' | 'Criminal' | 'Writ' | 'Consumer' | 'Family';

  // Criminal-specific fields
  firNumber?: string;
  policeStation?: string;
  custodyStatus?: 'judicial_custody' | 'anticipatory_bail';

  // Civil-specific fields
  dateOfCauseOfAction?: string;

  // Family-specific fields
  dateOfMarriage?: string;
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

export interface SavedDraft {
  id: string;
  user_id: string;
  petition_type: string;
  draft_content: string;
  form_data: any;
  created_at: string;
}
