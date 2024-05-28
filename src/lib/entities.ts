export type User = {
  username: string;
};

export type NewNote = {
  id?: number;
  body: string;
};

export type SavedNote = NewNote & {
  id: number;
};

export type Note = NewNote | SavedNote;

export type PopupPosition = {
  x: number;
  y: number;
};
