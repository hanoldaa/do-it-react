React Starter Project
---

Setup
---

```
npm install
```

Setup Firebase App in Firebase Console
---

###Add Firebase to your app
To add Firebase to your app, you'll need a Firebase project and a short snippet of initialization code that has a few details about your project.

1. Create a Firebase project in the [Firebase console](https://console.firebase.google.com/).

 * If you don't have an existing Firebase project, click Add project, then enter either an existing Google Cloud Platform project name or a new project name.
 
 * If you have an existing Firebase project that you'd like to use, select that project from the console.

2. From the project overview page in the Firebase console, click the `+ Add App` button and select the javascript platform (`</>`). Copy the `config` object.

3. Create a new javascript file: `/src/fire.js`

 * Add the following code, replacing the config object with the config object copied from step 2.

```javascript
import firebase from 'firebase';

var config = {
  apiKey: "abcdefgHIJKLMNopqrsTUvwxYZ-123",
  authDomain: "your-app12345.firebaseapp.com",
  databaseURL: "https://your-app12345.firebaseio.com",
  projectId: "your-app12345",
  storageBucket: "your-app12345.appspot.com",
  messagingSenderId: "1234567890"
};

var fire = firebase.initializeApp(config);
export default fire;
```

4. Save `fire.js`.

###Install Firebase CLI Tools

```
$ npm install -g firebase-tools
$ firebase login       # Login to firebase if you aren't already
$ firebase use --add   # Select the firebase project created above.
```

Usage
---

Start the development server with this command:

```
npm run start
```

Build
---

```
npm run build
```

Deploy
---

```
firebase deploy
```
