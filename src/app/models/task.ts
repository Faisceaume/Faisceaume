export class Task {
  taskid: string;
  projectid: string;
  memberid?: string;
  title: string;
  description: string;
  component?: string;
  status: TASK_STATUS_EN;
  timestamp: number;
  timeestimated: number;
  timespent?: number;
  timestampcompleted?: number;
  location: number;
}

export enum TASK_STATUS_EN {
  UNTREATED = 'untreated',
  PENDING = 'pending',
  DONE = 'done'
};

export enum TASK_STATUS_FR {
  UNTREATED = 'Non traitée',
  PENDING = 'En cours de réalisation',
  DONE = 'Terminée'
};