# Flashcards For Developers

> "That's how knowledge works. It builds up, like compound interest." - Warren Buffett

This project contains a small site for studying developer flashcards. This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and it may be useful to refer to its [User Guide](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Installing

Clone this project and update your path:

```sh
git clone git@github.com:nlaz/flashcards-for-developers.git
cd flashcards-for-developers
```

Install dependencies and run application.

```sh
yarn install
yarn start
```

Open [http://localhost:3000/](http://localhost:3000/) to view the app in the browser.

### Configuration

All configuration options can be passed to the server using environment variables. The following variables are supported:

- `PORT` - The port on which the server will listen to requests (Default: 3000)
- `DATABASE_URI` - The uri of the database used to store data

Environment variables are set by adding files like `.env` which should not be checked into source control. Additional `.env` files can be used:

- `.env`: Default.
- `.env.local`: Local overrides. **This file is loaded for all environments except test.**
- `.env.development`, `.env.test`, `.env.production`: Environment-specific settings.
- `.env.development.local`, `.env.test.local`, `.env.production.local`: Local overrides of environment-specific settings.

For more information check the [`create-react-app` docs](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-development-environment-variables-in-env).

## Available Scripts

In the project directory, you can run:

### `yarn web`

Runs the frontend side of the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn server`

Runs the server side of the app in the development mode.<br>
Make API requests to [http://localhost:5000](http://localhost:5000) to interact with the server.

The server will also reload if you make edits.<br>
_Note:_ It also initially loads the built React app on the server at [http://localhost:5000](http://localhost:5000)

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `yarn build`

Builds the React app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.

### `yarn deploy`

Builds the React app for production and runs the server so the the app is ready to be deployed.

## Syncing with Airtable

The database uses Airtable to manage our content. We have three records that we sync from Airtable: `Collections`, `Decks`, and `Cards`. If Airtable is updated, the changes will have to be synced to the database. There are three scripts provided in the `scripts/` folder to sync these records:

- `sync_cards.js`
- `sync_collections.js`
- `sync_decks.js`

Running these scripts will fetch the data from Airtable and **OVERWRITE** the records in the database. The database can changed through environment variables. The default environment is `development`.

**Example:**

```bash
node scripts/sync_cards.js
```

## Contributing

Interested in contributing? Contact [@nlaz](https://github.com/nlaz) for help to get started.

## License

This project is [MIT licensed](./LICENSE.md).
