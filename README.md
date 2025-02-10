
# Universal Login Boilerplate App

This boilerplate application helps you get started with building a customized login screen for Auth0 using React, TypeScript, and Vite. Universal Login offers a streamlined experience for users and does not require JavaScript for customization.

⚠ This boilerplate app is intended to be used alongside a technical documentation guide published [here](https://auth0.com/docs/customize/login-pages/advanced-customizations/getting-started).

##  Documentation

- [Quickstart](https://auth0.com/docs/customize/login-pages/advanced-customizations/getting-started/sdk-quickstart) - our guide for getting started with ACUL development.
- [ACUL JS SDK](https://github.com/auth0/universal-login/tree/master/packages/auth0-acul-js) - The Auth0 ACUL JS SDK, integrated into this boilerplate for handling authentication flows.



## Getting Started

Follow these steps to get the application up and running locally:

### 1. Clone the Repository

```sh
git clone https://github.com/auth0/auth0-acul-react-boilerplate.git
cd auth0-acul-react-boilerplate
```

### 2. Install Dependencies


Install the dependencies:

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
cd dist
npx http-server dist -p 8080
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
import { LoginId } from '@auth0/auth0-acul-js';
import { useState } from 'react';

export const LoginIdScreen = () => {
  const loginManager = new LoginId();
  const [email, setEmail] = useState('');

  return (
    <div className="w-[100vw] min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-lg shadow-md">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        <button 
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => loginManager.login({ username: email })}
        >
          Continue
        </button>

        {loginManager.transaction.alternateConnections?.map(({ name, strategy }) => (
          <button
            key={name}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => loginManager.socialLogin({ connection: name })}
          >
            Continue with {strategy}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LoginIdScreen
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

