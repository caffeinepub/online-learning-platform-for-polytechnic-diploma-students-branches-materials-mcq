export interface BranchData {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const BRANCHES: BranchData[] = [
  {
    id: 'computer',
    name: 'Computer Engineering',
    icon: '/assets/generated/branch-computer.dim_256x256.png',
    description: 'Software, hardware, and computing systems'
  },
  {
    id: 'it',
    name: 'Information Technology',
    icon: '/assets/generated/branch-it.dim_256x256.png',
    description: 'Networks, databases, and IT infrastructure'
  },
  {
    id: 'mechanical',
    name: 'Mechanical Engineering',
    icon: '/assets/generated/branch-mechanical.dim_256x256.png',
    description: 'Machines, thermodynamics, and manufacturing'
  },
  {
    id: 'electrical',
    name: 'Electrical Engineering',
    icon: '/assets/generated/branch-electrical.dim_256x256.png',
    description: 'Power systems, circuits, and electronics'
  },
  {
    id: 'civil',
    name: 'Civil Engineering',
    icon: '/assets/generated/branch-civil.dim_256x256.png',
    description: 'Construction, structures, and infrastructure'
  },
  {
    id: 'electronics',
    name: 'Electronics Engineering',
    icon: '/assets/generated/branch-electronics.dim_256x256.png',
    description: 'Electronic devices, circuits, and communication'
  },
  {
    id: 'automobile',
    name: 'Automobile Engineering',
    icon: '/assets/generated/branch-automobile.dim_256x256.png',
    description: 'Vehicle design, engines, and automotive systems'
  }
];

export function getBranchByName(name: string): BranchData | undefined {
  return BRANCHES.find(b => b.name.toLowerCase().includes(name.toLowerCase()));
}
