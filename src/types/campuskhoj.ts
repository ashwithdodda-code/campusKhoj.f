export type Category = 
  | 'ELECTRONICS'
  | 'ID_CARDS_WALLETS'
  | 'BOOKS_STATIONERY'
  | 'KEYS'
  | 'ACCESSORIES'
  | 'CLOTHING'
  | 'BAGS'
  | 'OTHER';

export type ItemType = 'LOST' | 'FOUND';
export type ItemStatus = 'LOST' | 'FOUND' | 'CLAIMED' | 'RETURNED';
export type ClaimStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED';
export type UserRole = 'STUDENT' | 'STAFF' | 'ADMIN';

export interface User {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  collegeId: string;
  departmentOrBranch: string;
  canApproveClaims: boolean;
  avatarColor?: string;
  yearOfStudy?: number;
  designation?: string;
  office?: string;
}

export interface Item {
  itemId: string;
  name: string;
  category: Category;
  type: ItemType;
  status: ItemStatus;
  description: string;
  location: string;
  incidentDate: string; // YYYY-MM-DD
  reportedByUserId: string;
  reportedByUserName: string;
  storageLocation?: string; // For FOUND items
  suspectedLossArea?: string; // For LOST items
  createdAt: string;
}

export interface Claim {
  claimId: string;
  itemId: string;
  itemName: string;
  itemCategory: Category;
  itemType: ItemType;
  itemLocation: string;
  claimantId: string;
  claimantName: string;
  claimantEmail: string;
  claimantCollegeId: string;
  proofDescription: string;
  contactPhone: string;
  status: ClaimStatus;
  adminReviewNotes?: string;
  reviewedByAdminName?: string;
  reviewedAt?: string;
  handoverConfirmed: boolean;
  handoverConfirmedAt?: string;
  createdAt: string;
}

export interface MatchScoreResult {
  lostItem: Item;
  foundItem: Item;
  totalScore: number;
  categoryScore: number;
  locationScore: number;
  dateScore: number;
  keywordScore: number;
  reasons: string[];
  isQualified: boolean; // score >= 50
}

export const CATEGORY_LABELS: Record<Category, string> = {
  ELECTRONICS: 'Electronics & Gadgets',
  ID_CARDS_WALLETS: 'ID Cards & Wallets',
  BOOKS_STATIONERY: 'Books & Stationery',
  KEYS: 'Keys & Keychains',
  ACCESSORIES: 'Accessories & Watches',
  CLOTHING: 'Clothing & Apparel',
  BAGS: 'Bags & Backpacks',
  OTHER: 'Other Campus Items',
};

export const CAMPUS_LOCATIONS = [
  'Block A - Computer Lab 3',
  'Block B - Mechanical Workshop',
  'Central Library - 2nd Floor Reading Room',
  'Campus Canteen Food Court',
  'Student Vehicle Parking Bay B',
  'Main Auditorium - Ground Tier',
  'Seminar Hall 2 - Admin Block',
  'Sports Arena & Gymnasium',
  'Physics & Chemistry Science Labs',
];
