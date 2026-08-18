// env variables
// command line arguments
// exit code
// process lifecycle events

// read backend port from env file
// read secrets - db urls, api keys, password, google auth secret
// read CLI arguments in scripts

// process.env

import process from "node:process";

// dotenv

// const nodeEnv = process.env.NODE_ENV ?? "development"

// process.env values are always string or undefined

// const port = Number(process.env.PORT ?? 3000)

// process.argv ->

// [
//     "/path/to/node",
//     "src/01-process-object.ts",
//     "start"
// ]

const command = process.argv[2] ?? "start";

// fail flag
// crash flag

const shouldFail = process.argv.includes("--fail");
const shouldCrash = process.argv.includes("--crash");

// do not start async here
// node is already shutting down
// final log, final cleanup

process.on("exit", (code) => {
  console.log(`Process finished with exit code ${code}`);
});

function runApp(): void {
  console.log({
    command,
  });

  if (shouldFail) {
    console.error("Manual failure trigered with --fail flag");
    process.exit(1);
  }

  if (shouldCrash) {
    console.error("Manual crash trigered with --crash flag");
    process.exit(1);
  }
}

runApp();
