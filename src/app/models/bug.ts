export class Bug {
  bugid: string;
  projectid: string;
  uid: string; // User who reported the bug (dev or client)
  memberid?: string; // Dev working to fix the bug 
  title: string;
  description?: string;
  descriptionclient?: string;
  component?: string;
  status: BUG_STATUS_EN;
  picture?: string;
  timestamp: number;
  timeestimated?: number;
  timespent?: number;
  timestampcompleted?: number;
  location: number;
};

export enum BUG_STATUS_EN {
  UNTREATED = 'untreated',
  PENDING = 'pending',
  RESOLVED = 'resolved'
};

export enum BUG_STATUS_FR {
  UNTREATED = 'Non traité',
  PENDING = 'En cours de correction',
  RESOLVED = 'Corrigé'
};