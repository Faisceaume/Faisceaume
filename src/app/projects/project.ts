import { Task } from '../tasks/task';

export class Project {
    projectid: string;
    title: string;
    picture: string;
    timestamp: number;
    tasks: Task[];
}
