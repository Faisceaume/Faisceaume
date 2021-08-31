export enum Status {
  DONE = 'done',
  UNTREATED = 'untreated'
}

export class Task {
    taskid: string;
    userid: string;
    memberid: string;
    title: string;
    description: string;
    time: number;
    projectid: string;
    //statut: boolean;
    status?: Status;
    timestamp: any;
    memberpicture?: string;
    location: number;
    timespent: any;
}
