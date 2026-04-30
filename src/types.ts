export interface ScentNote {
  name: string;
  image: string;
}

export type PerfumeStatus = 'owned' | 'wanted'

export interface PerfumePost {
  id: string;
  perfumeImage: string;
  name: string;
  brand: string;
  fragranceFamily: string[];
  perfumer: string;
  scentNotes: ScentNote[];
  createdAt: Date;
  status: PerfumeStatus;
}

export interface DailyPerfume {
  date: string;
  perfumeName: string;
  perfumeImage: string;
  postId?: string;
}

export const FRAGRANCE_FAMILIES = [
  '花香调',
  '果香调',
  '柑橘调',
  '绿香调',
  '水生调',
  '醛香调',
  '馥奇香调',
  '木质调',
  '东方调',
  '美食调',
  '皮革调',
  '烟草调'
]
