# react-game-template



### electron setup

- https://medium.com/@andrew.rapo/using-create-react-app-craco-to-build-apps-for-both-the-web-and-electron-8f4ab827877f

Verified that electron-builder successfully builds a standalone Mac app.

Updated npm scripts:
```json
"scripts": {
    "start": "env-cmd -f .env.web craco start",
    "start:electron": "electron .",
    "build": "craco build",
    "build:electron": "env-cmd -f .env.electron craco build",
    "test": "react-scripts test",
    "test:craco": "craco test",
    "eject": "echo eject:disabled",
    "pack": "electron-builder --dir",
    "dist": "electron-builder"
  }
```

### initial project setup

- https://create-react-app.dev/docs/getting-started

```
yarn create react-app react-app-template --template typescript
```

```
Created git commit.

Success! Created react-app-template at /Users/.../react-app-template
Inside that directory, you can run several commands:

  yarn start
    Starts the development server.

  yarn build
    Bundles the app into static files for production.

  yarn test
    Starts the test runner.

  yarn eject
    Removes this tool and copies build dependencies, configuration files
    and scripts into the app directory. If you do this, you can’t go back!

We suggest that you begin by typing:

  cd react-app-template
  yarn start

Happy hacking!
✨  Done in 167.03s.
```

### reference links
- https://create-react-app.dev/docs/getting-started
- https://medium.com/@johndyer24/building-a-production-electron-create-react-app-application-with-shared-code-using-electron-builder-c1f70f0e2649
- https://finbits.io/blog/electron-create-react-app-electron-builder/

### electron notes
- https://stackoverflow.com/questions/61021885/electron-window-require-is-not-a-function-even-with-nodeintegration-set-to-true