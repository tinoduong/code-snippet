import { Language } from './enums';

export interface Snippet {
    id: string;
    data: string;
    name: string;
    dateCreated: Date;
    dateModified: Date;
    language: Language;
    locked: boolean;
    isHidden?: boolean;
}
