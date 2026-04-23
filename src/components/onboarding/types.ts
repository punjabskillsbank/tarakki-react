export interface OnboardingData {
  email?: string;
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;
  purpose?: string;
  role?: string;
  teamSize?: string;
  companySize?: string;
  whatToManage?: string;
  focusArea?: string;
  howDidYouHear?: string[];
  teamMembers?: Array<{ email: string; role: string }>;
  boardName?: string;
  columns?: string[];
  dashboards?: string[];
  viewLayout?: string;
  projects?: string[];
}
