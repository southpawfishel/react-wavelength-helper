# Wavelength Helper Client

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## App Overview

This is the frontend client for playing the Wavelength game in your browser. The app makes use of several important third party libraries to facilitate the design.

- React, for the declarative UI
- Redux, for immutable functional state management
- Immutable.js, for data structures that are immutable by default
- Milligram, a minimalist CSS library for styling

The app expects that it's being served on the same box that is also running the game server. The server groups players based on their URL route, so `https://gameserver.com/foo` would put that user in the room "foo". The app expects that there's an additional route of the app's location with "ws" appended, so the backend to connect to for the previous example would be `ws://gameserver.com/foo/ws`

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.  
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.  
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.  
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
