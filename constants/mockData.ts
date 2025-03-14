export interface Developer {
  id: string;
  name: string;
  age: number;
  role: string;
  experience: number;
  location: string;
  bio: string;
  avatar: string;
  images: string[];
  skills: string[];
  githubStats: {
    repos: number;
    followers: number;
    contributions: number;
  };
  languages: { name: string; percentage: number }[];
}

export const mockDevelopers: Developer[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    age: 28,
    role: 'Senior Full Stack Developer',
    experience: 6,
    location: 'San Francisco, CA',
    bio: 'Passionate about building scalable web applications and mentoring junior developers. Love working with React and Node.js.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
    ],
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    githubStats: {
      repos: 45,
      followers: 890,
      contributions: 2547,
    },
    languages: [
      { name: 'TypeScript', percentage: 40 },
      { name: 'JavaScript', percentage: 30 },
      { name: 'Python', percentage: 20 },
      { name: 'Go', percentage: 10 },
    ],
  },
  {
    id: '2',
    name: 'Alex Rivera',
    age: 31,
    role: 'DevOps Engineer',
    experience: 8,
    location: 'Seattle, WA',
    bio: 'Infrastructure as code enthusiast. Specialized in containerization and CI/CD pipelines.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d'
    ],
    skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins'],
    githubStats: {
      repos: 32,
      followers: 654,
      contributions: 1876,
    },
    languages: [
      { name: 'Python', percentage: 35 },
      { name: 'Go', percentage: 30 },
      { name: 'Shell', percentage: 25 },
      { name: 'Ruby', percentage: 10 },
    ],
  },
  {
    id: '3',
    name: 'Emily Zhang',
    age: 26,
    role: 'Mobile Developer',
    experience: 4,
    location: 'New York, NY',
    bio: 'Creating beautiful and performant mobile experiences. React Native evangelist.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    images: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2'
    ],
    skills: ['React Native', 'iOS', 'Android', 'Redux', 'GraphQL'],
    githubStats: {
      repos: 28,
      followers: 432,
      contributions: 1543,
    },
    languages: [
      { name: 'TypeScript', percentage: 45 },
      { name: 'Swift', percentage: 25 },
      { name: 'Kotlin', percentage: 20 },
      { name: 'Java', percentage: 10 },
    ],
  },
]; 