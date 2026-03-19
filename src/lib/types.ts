export type Level = 'Anfänger' | 'Fortgeschritten' | 'Experte';
export type Role = 'admin' | 'member' | 'instructor';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trial';
export type PlanType = 'basis' | 'premium' | 'masterclass';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  videoUrl?: string;
  isFree: boolean;
  order: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  instructor: string;
  instructorBio: string;
  duration: number; // total minutes
  lessonsCount: number;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  category: string;
  level: Level;
  tags: string[];
  modules: Module[];
  studentsCount: number;
  language: string;
  certificate: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  coursesCount: number;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  bio?: string;
  joinedAt: string;
  lastLoginAt: string;
  subscription?: Subscription;
  enrolledCourses: string[];
  completedLessons: string[];
}

export interface Subscription {
  id: string;
  userId: string;
  plan: PlanType;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  price: number;
  autoRenew: boolean;
}

export interface PricingPlan {
  id: string;
  type: PlanType;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  highlighted: boolean;
  ctaLabel: string;
  maxCourses: number | 'unlimited';
}

export interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  content: string;
  rating: number;
  courseTitle?: string;
}

export interface AdminStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalUsers: number;
  activeSubscriptions: number;
  totalCourses: number;
  completionRate: number;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  plan: PlanType;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  date: string;
  method: string;
}

export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  bgDark: string;
  bgCard: string;
  textPrimary: string;
  textSecondary: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
