export type Tier = 'Bronze' | 'Silver' | 'Gold';

export const calculateTier = (attendanceCount: number, projectCount: number): Tier => {
  const score = (attendanceCount * 2) + projectCount;
  
  if (score >= 50) return 'Gold';
  if (score >= 20) return 'Silver';
  return 'Bronze';
};

export const TIER_CONFIG = {
  Bronze: {
    color: 'text-slate-400',
    bg: 'bg-slate-400/10',
    border: 'border-slate-400/20',
    next: 20
  },
  Silver: {
    color: 'text-zinc-500',
    bg: 'bg-zinc-500/10',
    border: 'border-zinc-500/20',
    next: 50
  },
  Gold: {
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    next: Infinity
  }
};
