# New Wallet with Swap Functionality

## The Problem

### Part One: Wallet Design and Integration

Scope of Work: Design and develop a flexible wallet that is both embedded and browser-based. The wallet should seamlessly integrate with a partner’s application and offer full connectivity for testing on platforms such as Cloudflare or Vercel.

### Part Two: Swap Functionality

Scope of Work: Create a wallet that facilitates peer-to-peer (P2P) asset swaps. The wallet should support the swapping of at least four different assets by default and incorporate a pricing mechanism (oracles) to ensure optimal swaps.

## Demo video
<video src="public/preview.mp4" width="320" height="240" controls></video>

## Proposed solution

This solution integrates has a really visual and beautiful design for displaying tokens of wallet and balances. It has multiple integrations that let you send Tokens and also there's an integrated functionality to have Swapping of tokens.

## Technologies

- NextJs App Routing(v14)
- Typescript
- Tailwind
- Zustand
- Solana/Web3
- Pnpm

## Characteristics of this solution

- Fully typed solution
- Standardized(Atomic) components across the platform
- Dark/Light theme integration
- Modularized and well-organized code structure
- Accessibility compliance
- Fully responsive design
- Harmonious design
- Real-time data fetching
- Ready for future feature enhancements
- Easy integration with Vercel and similar platforms

## Install dependencies

```shell
pnpm install
```

## Configure environment variables

```shell
cp .env.example .env
vim .env
```

## Project Structure

```

/src
  env.mjs            - Contains all variables typed for platform
  constants.ts       - Any global variable for app, like APP_NAME
  /app               - Contains all routes, integrated using the new Next.js version
  /components/ui     - Houses all standardized atomic components
  /modules           - Each platform topic is organized into a specific folder
    /some-module
      /components    - Contains components specific to that topic
      /utils         - Contains utilities specific to that topic
      /data          - Contains data specific to that topic
      /store         - Contains state management for that topic
      /types         - Contains type definitions for that topic
```

Set the values of the environment variables in the .env file. Currently, there are no values, but this setup will allow for easy configuration in the future. Ensure integration with src/env.mjs for proper typing.

## Routes

The site is structured around a single main route, "/", which serves as the primary entry point. Additional functionalities, such as sending tokens and swapping, are accessible through interactive elements that open new drawers within this main route.

## Running the project

Make sure you have your .env file correctly set up as mentioned in Configure environment variables section.
To run the project in development mode, use:

```sh
pnpm dev
```

This runs the dev script specified in our package.json and will start a server that reloads the page as files are saved. The server typically runs at http://localhost:3000.

## Creating a production build

To create a production build, run:

```sh
pnpm build
```

This will generate an optimized build in the ./dist directory.

To serve the production build, use:

```sh
pnpm start
```

This will start a server to view the production build.
