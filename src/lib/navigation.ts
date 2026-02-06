/**
 * Navigation Configuration for PPSDM KMM Dashboard
 * Defines all navigation items, routes, and structure
 */

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number;
  disabled?: boolean;
}

export interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
}

// Personal Development Navigation Section
export const personalDevelopmentNav: NavSection = {
  id: 'personal-development',
  title: 'Personal Development',
  items: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: 'dashboard',
    },
    {
      id: 'content-discovery',
      label: 'Content Discovery',
      href: '/dashboard/content-discovery',
      icon: 'explore',
    },
    {
      id: 'goals',
      label: 'Goals',
      href: '/dashboard/goals',
      icon: 'flag',
    },
    {
      id: 'progress',
      label: 'Progress',
      href: '/dashboard/progress',
      icon: 'trending_up',
    },
    {
      id: 'achievements',
      label: 'Achievements',
      href: '/dashboard/achievements',
      icon: 'emoji_events',
    },
    {
      id: 'journal',
      label: 'Journal',
      href: '/dashboard/journal',
      icon: 'edit_note',
    },
  ],
};


// Analysis Navigation Section
export const analysisNav: NavSection = {
  id: 'analysis',
  title: 'Analysis',
  items: [
    {
      id: 'dimensions',
      label: '9 Dimensions',
      href: '/dashboard/dimensions',
      icon: 'pentagon',
    },
    {
      id: 'ecosystem',
      label: 'Ecosystem',
      href: '/dashboard/ecosystem',
      icon: 'hub',
    },
  ],
};

// Bottom Navigation Links
export const bottomNav: NavItem[] = [
  {
    id: 'settings',
    label: 'Settings',
    href: '/dashboard/settings',
    icon: 'settings',
  },
  {
    id: 'logout',
    label: 'Log Out',
    href: '/auth/logout',
    icon: 'logout',
  },
];

// All navigation sections combined
export const dashboardNavigation: NavSection[] = [
  personalDevelopmentNav,
  analysisNav,
];

// Quick actions for dashboard home
export const quickActions = [
  {
    id: 'log-activity',
    label: 'Log Activity',
    description: 'Record a new achievement',
    icon: 'edit_square',
    href: '/dashboard/journal/new',
    color: 'primary',
  },
  {
    id: 'set-goal',
    label: 'Set Goal',
    description: 'Define your next target',
    icon: 'flag',
    href: '/dashboard/goals/new',
    color: 'gold',
  },
  {
    id: 'write-reflection',
    label: 'Write Reflection',
    description: 'Review your progress',
    icon: 'auto_stories',
    href: '/dashboard/journal',
    color: 'purple',
  },
];

// 9 Dimensions Data Structure
export interface Dimension {
  id: number;
  name: string;
  category: 'hard' | 'soft';
  score: number;
  previousScore?: number;
  icon: string;
  description: string;
  color: string;
}

export const dimensions: Dimension[] = [
  {
    id: 1,
    name: 'Cognitive & Intellectual',
    category: 'hard',
    score: 75,
    previousScore: 70,
    icon: 'psychology',
    description: 'Critical thinking, problem-solving, and intellectual curiosity',
    color: '#3B82F6',
  },
  {
    id: 2,
    name: 'Emotional & Social',
    category: 'soft',
    score: 82,
    previousScore: 78,
    icon: 'emoji_emotions',
    description: 'Emotional intelligence and interpersonal relationships',
    color: '#EF4444',
  },
  {
    id: 3,
    name: 'Spiritual & Values',
    category: 'soft',
    score: 68,
    previousScore: 65,
    icon: 'self_improvement',
    description: 'Personal values, purpose, and spiritual growth',
    color: '#8B5CF6',
  },
  {
    id: 4,
    name: 'Physical & Health',
    category: 'soft',
    score: 70,
    previousScore: 68,
    icon: 'fitness_center',
    description: 'Physical fitness, health habits, and wellbeing',
    color: '#10B981',
  },
  {
    id: 5,
    name: 'Creative & Innovation',
    category: 'soft',
    score: 78,
    previousScore: 72,
    icon: 'lightbulb',
    description: 'Creativity, innovation, and artistic expression',
    color: '#F59E0B',
  },
  {
    id: 6,
    name: 'Professional & Career',
    category: 'hard',
    score: 65,
    previousScore: 60,
    icon: 'work',
    description: 'Career development and professional skills',
    color: '#06B6D4',
  },
  {
    id: 7,
    name: 'Leadership & Influence',
    category: 'soft',
    score: 72,
    previousScore: 65,
    icon: 'groups',
    description: 'Leadership abilities and influence on others',
    color: '#EC4899',
  },
  {
    id: 8,
    name: 'Financial & Resource',
    category: 'hard',
    score: 60,
    previousScore: 58,
    icon: 'account_balance',
    description: 'Financial literacy and resource management',
    color: '#14B8A6',
  },
  {
    id: 9,
    name: 'Environmental & Global',
    category: 'soft',
    score: 55,
    previousScore: 50,
    icon: 'public',
    description: 'Environmental awareness and global citizenship',
    color: '#22C55E',
  },
];

// Goals Data Structure
export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'soft' | 'hard';
  progress: number;
  targetDate: string;
  status: 'active' | 'completed' | 'overdue';
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export const goals: Goal[] = [
  {
    id: '1',
    title: 'Complete Emotional Intelligence Training',
    description: 'Finish the 4-week EQ certification program',
    category: 'soft',
    progress: 75,
    targetDate: '2024-03-15',
    status: 'active',
    milestones: [
      { id: 'm1', title: 'Self-awareness module', completed: true, completedAt: '2024-01-15' },
      { id: 'm2', title: 'Self-regulation module', completed: true, completedAt: '2024-01-30' },
      { id: 'm3', title: 'Social awareness module', completed: true, completedAt: '2024-02-10' },
      { id: 'm4', title: 'Relationship management', completed: false },
    ],
  },
  {
    id: '2',
    title: 'Learn Python for Data Analysis',
    description: 'Master pandas, numpy, and matplotlib libraries',
    category: 'hard',
    progress: 45,
    targetDate: '2024-04-30',
    status: 'active',
    milestones: [
      { id: 'm1', title: 'Python basics', completed: true, completedAt: '2024-01-10' },
      { id: 'm2', title: 'Pandas fundamentals', completed: true, completedAt: '2024-01-25' },
      { id: 'm3', title: 'NumPy operations', completed: false },
      { id: 'm4', title: 'Data visualization', completed: false },
      { id: 'm5', title: 'Final project', completed: false },
    ],
  },
  {
    id: '3',
    title: 'Develop Public Speaking Skills',
    description: 'Present at 3 campus events this semester',
    category: 'soft',
    progress: 33,
    targetDate: '2024-05-20',
    status: 'active',
    milestones: [
      { id: 'm1', title: 'First presentation', completed: true, completedAt: '2024-02-05' },
      { id: 'm2', title: 'Second presentation', completed: false },
      { id: 'm3', title: 'Third presentation', completed: false },
    ],
  },
  {
    id: '4',
    title: 'Complete Financial Planning Course',
    description: 'Understand budgeting, investing, and retirement planning',
    category: 'hard',
    progress: 100,
    targetDate: '2024-02-01',
    status: 'completed',
    milestones: [
      { id: 'm1', title: 'Budgeting basics', completed: true, completedAt: '2024-01-05' },
      { id: 'm2', title: 'Investment principles', completed: true, completedAt: '2024-01-15' },
      { id: 'm3', title: 'Retirement planning', completed: true, completedAt: '2024-01-25' },
    ],
  },
];

// Stats for dashboard
export interface DashboardStats {
  activeGoals: number;
  completedAssessments: number;
  currentLevel: number;
  streak: number;
  overallScore: number;
}

export const dashboardStats: DashboardStats = {
  activeGoals: 5,
  completedAssessments: 12,
  currentLevel: 4,
  streak: 15,
  overallScore: 72.5,
};

// Recent Activity
export interface Activity {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  timestamp: string;
  badge?: {
    text: string;
    color: string;
  };
}

export const recentActivities: Activity[] = [
  {
    id: '1',
    title: 'Cognitive Dimension Updated',
    description: 'Completed "Advanced Logic Workshop"',
    icon: 'psychology',
    iconColor: 'blue',
    timestamp: '2h ago',
    badge: { text: '+5% Growth', color: 'green' },
  },
  {
    id: '2',
    title: 'Emotional Intelligence Badge Earned',
    description: 'Verified by Mentor Sarah J.',
    icon: 'favorite',
    iconColor: 'red',
    timestamp: 'Yesterday',
    badge: { text: 'New Badge', color: 'gold' },
  },
  {
    id: '3',
    title: 'Social Project Submission',
    description: 'Submitted "Community Outreach Plan"',
    icon: 'groups',
    iconColor: 'teal',
    timestamp: '2 days ago',
    badge: { text: 'Pending Review', color: 'slate' },
  },
];

// Helper function to calculate dimension stats
export function getDimensionStats(dimensions: Dimension[]) {
  const total = dimensions.length;
  const avgScore = dimensions.reduce((acc, d) => acc + d.score, 0) / total;
  const strongest = dimensions.reduce((prev, current) => 
    prev.score > current.score ? prev : current
  );
  const weakest = dimensions.reduce((prev, current) => 
    prev.score < current.score ? prev : current
  );
  const hardSkills = dimensions.filter(d => d.category === 'hard');
  const softSkills = dimensions.filter(d => d.category === 'soft');
  const hardAvg = hardSkills.reduce((acc, d) => acc + d.score, 0) / hardSkills.length;
  const softAvg = softSkills.reduce((acc, d) => acc + d.score, 0) / softSkills.length;

  return {
    total,
    avgScore: Math.round(avgScore * 10) / 10,
    strongest,
    weakest,
    hardAvg: Math.round(hardAvg * 10) / 10,
    softAvg: Math.round(softAvg * 10) / 10,
    hardCount: hardSkills.length,
    softCount: softSkills.length,
  };
}
