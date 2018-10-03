# Set up

- Follow the steps in setting up the backend.
- In the Firebase Console, Choose "Add Firebase to your web project" copy the values of `apiKey`, `databaseURL`, and the name of your uploads bucket and paste them in to `development.env` and `production.env`.
- Run `npm install` to install dependencies.

## Development

```sh
npm start
```

## Deployment

```sh
firebase deploy
```

# Browsers targeted

```sh
npx browserslist ">0.25% in my stats, not IE > 0"

chrome 69
chrome 68
chrome 67
edge 17
edge 16
firefox 61
ios_saf 11.3-11.4
safari 11.1
safari 11
```
