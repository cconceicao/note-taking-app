import { NewNote, Note, SavedNote, User } from './entities';

export const SESSION = 'surfe_session_username';

export const API_NOTES = `https://challenge.surfe.com/${SESSION}/notes`;
export const API_USERS = 'https://challenge.surfe.com/users';

enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
}

const getRequestOptions = ({ method }: { method: HTTPMethod }): RequestInit => {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
};

async function request({
  endpoint,
  options,
}: {
  endpoint: string;
  options: RequestInit;
}) {
  const response = await fetch(endpoint, options);
  if (!response.ok) {
    throw Error(`${response.status} - ${response.statusText}`);
  }

  const isJson = response.headers
    .get('content-type')
    ?.includes('application/json');
  const data = isJson ? await response.json() : null;

  return data;
}

export const fetchUsers = (): Promise<User[]> =>
  request({
    endpoint: API_USERS,
    options: {
      ...getRequestOptions({ method: HTTPMethod.GET }),
    },
  });

export const fetchNotes = (): Promise<SavedNote[]> =>
  request({
    endpoint: API_NOTES,
    options: {
      ...getRequestOptions({ method: HTTPMethod.GET }),
    },
  });

export const createNoteAPI = (newNote: NewNote): Promise<SavedNote> =>
  request({
    endpoint: API_NOTES,
    options: {
      ...getRequestOptions({ method: HTTPMethod.POST }),
      body: JSON.stringify(newNote),
    },
  });

export const updateNoteAPI = (note: Note): Promise<SavedNote> =>
  request({
    endpoint: `${API_NOTES}/${note.id}`,
    options: {
      ...getRequestOptions({ method: HTTPMethod.PUT }),
      body: JSON.stringify({ body: note.body }),
    },
  });
