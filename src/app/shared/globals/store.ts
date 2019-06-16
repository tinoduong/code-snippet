import { Folder } from './folder';
import { SyntaxTheme } from '../globals';

export interface Store {
    version: string;
    theme: SyntaxTheme;
    folders: Folder[];
}
