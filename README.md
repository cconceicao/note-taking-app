# Note taking app

Hi!
I'm Cláudia Conceição, a frontend engineer applying to be your team mate.
Here's my coding challege: a simple note taking app.
Have fun.

# The app

The project had the following requirements:

- The note should auto-save when the user stops typing
- The note should load again on page refresh
- When typing the character @... a list of names should appear, and:
  - The available users to mention should be updated when the user types
  - Only the 5 most relevant results should be displayed
  - The mention should have a special style

# Project tech stack

- React
- Typescript
- Tailwind CSS
- React testing library

# Run the project

```
npm install
npm run dev
```

# Test the project

```
npm run test
```

# Future improvements

## Code

**CSS**

- Write all the CSS with [Tailwind](https://tailwindcss.com/) classes

**Tests**

- Use [Puppeteer](https://pptr.dev/), as it's not possible to simulate events on `contenteditable` with `testing-react-library`, or any testing library that uses `js-dom`, because of a limitation on `js-dom` itself.
- Add tests to `<NoteEditor />`

## Features

- Provide a way to set the `userSession` , so each user can have his/her own notes lists
- Delete note, once the API provides the endpoint. The delete button element is commented on the `<ListemItem />`

## UI

- Disable **note editor** button while note is being saved
- Disable **"Create new note"** button while note is being saved
- Update **suggestions popup** position when page is resized
- Start **"tagging mode"** when tag is clicked
- When hovering a **tag**, display user information
- Improve responsiveness
