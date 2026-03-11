export type ApprovalStatus = 'Pending' | 'Lead Approved' | 'Admin Approved' | 'Rejected';

export interface Course {
  id?: string;
  courseName: string;
  courseDuration: number;
  courseDescription: string;
  technology: string;
  launchUrl: string;
  approvalStatus: ApprovalStatus;
  addedBy?: string;
  leadApprovedBy?: string;
  adminApprovedBy?: string;
  createdAt?: Date;
}
