export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  type: 'lost' | 'found';
  category: string;
  location: {
    lat: number;
    lng: number;
  };
  date: Date;
  images: string[];
  status: 'pending' | 'claimed' | 'approved' | 'rejected';
  userId: string;
  claimedBy?: string;
  createdAt: Date;
}

export interface Claim {
  id: string;
  itemId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  proofDescription: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  claimId: string;
  senderId: string;
  content: string;
  createdAt: Date;
}