export class Error {
  code: string;
  message: string;
};

export class DialogContent {
  title: string;
  message: string;
};


export const TIMES_TABLE = [1, 2, 4, 6, 8, 12, 24, 48, 72];

export const ITEMS_PER_PAGE_TABLE = [5, 10, 15, 20];


export enum IMG_FOLDERS_NAMES {
  BUGS = 'bugs-images',
  MEMBERS = 'members-images',
  PROJECTS = 'projects-images',
};


export enum CSS_VAR_NAMES_TEXT_COLOR {
  SUCCESS = 'var(--success-text-color)',
  WARNING = 'var(--warning-text-color)',
  DANGER = 'var(--danger-text-color)'
};

export enum CSS_VAR_NAMES_BG_COLOR {
  SUCCESS = 'var(--success-bg-color)',
  WARNING = 'var(--warning-bg-color)',
  DANGER = 'var(--danger-bg-color)'
};


export enum STATUS_ICON_NAMES {
  UNTREATED = 'clear',
  PENDING = 'loop',
  DONE = 'done'
};