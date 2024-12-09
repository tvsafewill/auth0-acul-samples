
# Universal Login Boilerplate App

This boilerplate application helps you get started with building a customized login screen for Auth0 using React, TypeScript, and Vite. Universal Login offers a streamlined experience for users and does not require JavaScript for customization.

## Prerequisites

Before you start, ensure you have the following:

1. An Auth0 staging or development tenant with an active [custom domain](https://auth0.com/docs/customize/custom-domains).
2. Configure the Auth0 tenant to use the [Identifier First Authentication Profile](https://auth0.com/docs/authenticate/login/auth0-universal-login/identifier-first).
3. A [React quickstart](https://github.com/auth0-samples/auth0-react-samples/tree/master/Sample-01) application configured to run with your custom domain.
4. Configure [Application metadata](https://auth0.com/docs/get-started/applications/application-settings) to run the quickstart.

## Getting Started

Follow these steps to get the application up and running locally:

### 1. Clone the Repository

```sh
git clone https://github.com/auth0/auth0-acul-react-boilerplate.git
cd auth0-acul-react-boilerplate
```

### 2. Install Dependencies

Update the SDK dependency in `package.json` to the local ACUL JS SDK path:

```json
"devDependencies": {
  "@auth0/auth0-acul-js": "*"
}
```

Then install the dependencies:

```sh
npm install
```

### 3. Build the Application

```sh
npm run build
```

### 4. Serve the Application

After building the application, serve it locally using `http-server`:

```sh
npx http-server dist -p <port>
```

This will start a local server on the specified port. Access the application by navigating to the link provided in the terminal.

### 5. Test the Application with Sample Quickstart

Go to your quickstart application and log in.

## How the Login Works

### Creating and Appending the Root Element

In the `src/main.tsx` file, create a `div` element and append it to the `body` of the document. This is necessary for the Universal Login to work correctly:

```tsx
const rootElement = document.createElement("div");
rootElement.id = "root";

document.body.appendChild(rootElement);
document.body.style.overflow = "hidden";
```

### Initializing Screen Objects

In the `src/screens/LoginId/index.tsx` file, initialize an object for the LoginId screen to manage the state and behavior specific to this screen:

```tsx
import React, { useState } from "react";
import LoginIdInstance from "ul-javascript";

const LoginIdScreen: React.FC = () => {
  const [loginIdManager] = useState(() => new LoginIdInstance()); // Lazy initialization

  const handleLogin = () => {
    // Logic for continue
    loginIdManager.login({ username: "", captcha: "" });
  };

  return (
    <div>
      {/* Render the login ID screen content */}
      <button onClick={handleLogin}>Continue</button>
    </div>
  );
};

export default LoginIdScreen;
```

## Additional Information

- This project uses Vite for fast development and build processes.
- ESLint is configured to enforce code quality and consistency.
- SCSS is used for styling, focusing on modular and reusable styles.

For more details on customizing and extending this application, refer to the official documentation of the libraries and tools used:

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Auth0](https://auth0.com/)

### Have Fun with Your Own Coding Style!

Feel free to use your own coding style to create beautiful login pages. Customize the styles, add animations, and make the user experience delightful.

