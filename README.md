# Dept Dash Stack

![The Dept Dash Stack](https://repository-images.githubusercontent.com/465928257/a241fa49-bd4d-485a-a2a5-5cb8e4ee0abf)

Learn more about [Remix Stacks](https://remix.run/stacks).

```
# TODO point this at a tarball
npx create-remix --template devetry/dept-dash
```

## What's in the stack

- Static Types with [TypeScript](https://typescriptlang.org)
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Cypress](https://cypress.io)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and development environments
- Deploys to AWS using CDK:
  - Load balanced fargate service running your docker image
  - Cloudfront CDN
  - Postgres RDS on a private subnet
  - Managed Certificates if you're lucky enough to be using Route53 hosted zone for your domain

## Development

- Make sure you have [direnv](https://direnv.net) installed and hooked into your shell.

  ```sh
  direnv allow # should suceed and tell you about some env variables now available to you
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

### Relevant code:

<!-- TODO: write something once we have a page up
This is a pretty simple note-taking app, but it's a good example of how you can build a full stack app with Prisma and Remix. The prod functionality is creating users, logging in and out, and creating and deleting notes.

- creating users, and logging in and out [./app/models/user.server.ts](./app/models/user.server.ts)
- user sessions, and verifying them [./app/session.server.ts](./app/session.server.ts)
- creating, and deleting notes [./app/models/note.server.ts](./app/models/note.server.ts) -->

## Deployment

This Remix Stack comes with a GitHub Actions that handles automatically deploying your app to production and staging environments.

Prior to your first deployment, you'll need to do a few things:

- Create a new [GitHub Repository](https://repo.new), and then add it as the remote for your project. Do not push your app yet, as we'll add some secrets to the github repo.

  ```sh
  git remote add origin <ORIGIN_URL>
  ```

- Add an `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` to [your repo secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets).

Now that everything is set up you can commit and push your changes to your repo. Every commit to your `production` branch will trigger a deployment to your production environment, and every commit to your `staging` branch will trigger a deployment to your staging environment.

## Testing

### Cypress

We use Cypress for our End-to-End tests in this project. You'll find those in the `cypress` directory. As you make changes, add to an existing file or create a new file in the `cypress/e2e` directory to test your changes.

We use [`@testing-library/cypress`](https://testing-library.com/cypress) for selecting elements on the page semantically.

To run these tests in development, run `npm run test:e2e:dev` which will start the dev server for the app as well as the Cypress client. Make sure the database is running in docker as described above.

We have a utility for testing authenticated features without having to go through the login flow:

```ts
cy.login();
// you are now logged in as a new user
```

We also have a utility to auto-delete the user at the end of your test. Just make sure to add this in each test file:

```ts
afterEach(() => {
  cy.cleanupUser();
});
```

That way, we can keep your local db clean and keep your tests isolated from one another.

### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.

### Environment Variables

We use [direnv](https://direnv.net/) to load environment variables as soon as you enter this directory. That makes them available to node, but also to any tool you might run interactively (eg, `aws logs get-log-events` or `contentful space environment list`).

If you prefer, you can rip this out in favor of dotenv. Direnv is nice because it doesn't require each tool to know about looking in a particular file. Dotenv is nice because it doesn't require each dev to set it up on their computer (just once for the project).

This has no impact on deployed environments.
