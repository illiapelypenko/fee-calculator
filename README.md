# Commission fee calculator

This project calculates and outputs fees of operations. The fee is based on fetched config and depends on operation and user types. You can provide operations by reading the JSON file with the command below.

## Build & Run & Test

Firstly install all the necessary dependencies first: 

```npm i```

Then you can edit files inside src and run project:

```npm start``` - to run precompiled project

```npm test``` - to run project's tests

Then you can create a build:

```npm run build``` - to create app.js bundle of the project

And run the build:

```node app.js input.json``` - run final bundle with "input.json" as path to data file