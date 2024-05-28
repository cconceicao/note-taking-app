import { http, HttpResponse } from 'msw';
import { mockNotesList, mockUsersList } from './data';
import { SESSION } from './../src/lib/api';

export const handlers = [
  http.get(`https://challenge.surfe.com/${SESSION}/notes`, () => {
    return HttpResponse.json(mockNotesList);
  }),
  http.get('https://challenge.surfe.com/users', () => {
    return HttpResponse.json(mockUsersList);
  }),
];
