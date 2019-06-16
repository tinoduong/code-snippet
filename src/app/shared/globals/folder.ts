import { Snippet } from './snippet';

export interface Folder {
    id: string;
    name: string;
    snippets: Snippet[];
    tags: string[];
    isEditing: boolean;
    isHidden?: boolean;
}
