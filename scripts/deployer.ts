#!/usr/bin/env node

// Example (opinionated) configuration with yarn (I use TypeScript/Node environment, feel free to adapt this file to JS if needed). Note: I am running in Node 12.x environment with aws cli installed. 
// 1. Copy this file to scripts/deployer.ts (or any other you prefer)
// 2. Add "deploy": "ts-node --project tsconfig.scripts.json scripts/deployer.ts deploy" to your package.json file
// 3. You may also need to install devDependencies like yargs, @types/node, @types/yargs, js-yaml, @types/js-yaml
// 4. I also add tsconfig.scripts.json like the following:

/*
{
  "compilerOptions": {
    "baseUrl": "scripts",
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": false,
    "preserveConstEnums": true,
    "removeComments": true,
    "sourceMap": true,
    "strictNullChecks": true,
    "strict": true,
    "esModuleInterop": true,
    "target": "es2015",
    "module": "commonjs",
    "rootDir": "./"
  },
  "include": ["scripts/deployer.ts"]
}
*/

// 4. Create a stage ex. for test stage, create a serverless-test.yml. appName is the top level key in serverless-*.yml file. You will not need serverless.yml files anymore (you could add it to .gitignore).
// 5. In your CI/CD pipeline, add this command: yarn deploy serverless-test.yml (you can set DEPLOYMENT_BUCKET_NAME as env variable), or you can do DEPLOYMENT_BUCKET_NAME=app-deployment yarn deploy serverless-test.yml. Ensure you have set all secrets such as AWS access keys, region etc (I use env variables).
// This will:
// 1. Sync .serverless directory from S3
// 2. Copy serverless-test.yml to serverless.yml
// 3. Run npx serverless to deploy the serverless-next.js app
// 4. (Optional) Use aws cli to update Lambda/CloudFront as needed (previously I needed to update runtime/invalidate CloudFront cache but it's now supported in serverless-next.js
// 5. Sync .serverless directory back to S3

import * as fs from "fs";
import { execSync } from "child_process";
import yaml from "js-yaml";
import yargs from "yargs";

function readCloudFrontId(appName: string): string | null {
    let data;
    try {
        data = fs.readFileSync(`.serverless/Template.${appName}.CloudFront.json`);
    } catch (err) {
        if (err.code === "ENOENT") {
            console.error("CloudFront JSON file could not be found.");
            return null;
        } else {
            console.error("Error reading CloudFront JSON file.");
            return null;
        }
    }
    try {
        const struct = JSON.parse(data.toString());
        return struct["id"];
    } catch (err) {
        return null;
    }
}

function readLambdaName(appName: string): string | null {
    let data;
    try {
        data = fs.readFileSync(
            `.serverless/Template.${appName}.defaultEdgeLambda.json`
        );
    } catch (err) {
        if (err.code === "ENOENT") {
            console.error("Lambda JSON file could not be found.");
            return null;
        } else {
            console.error("Error reading Lambda JSON file.");
            return null;
        }
    }
    try {
        const struct = JSON.parse(data.toString());
        return struct["name"];
    } catch (err) {
        return null;
    }
}

function readBucketName(): string {
    const bucketName = process.env["DEPLOYMENT_BUCKET_NAME"];
    if (!bucketName) {
        console.error("DEPLOYMENT_BUCKET_NAME environment variable must be set");
        process.exit(1);
    }

    return bucketName;
}


const data = `
nextamplified:
  component: "@sls-next/serverless-component@1.19.0"
  inputs:
    roleArn: "arn:aws:iam::530645650598:role/unlimited-power"
`

function deploy(filename: string): void {
    try {
        console.log(`Reading Serverless file: ${filename}`);
        execSync(`cp ${filename} serverless.yml`, { stdio: "inherit" });
        // const serverless = yaml.load(fs.readFileSync("./serverless.yml", "utf8"));
        const serverless = yaml.load(data);


        const keys = Object.keys(serverless);
        const appName = keys[0];

        // Create deployment bucket if doesn't already exist
        console.log(
            "Try to create deployment bucket if it doesn't exist: " + readBucketName()
        );
        execSync(`aws s3 mb s3://${readBucketName()} || true`, {
            stdio: "inherit",
        });

        console.log("Syncing Serverless data from S3.");
        execSync(
            `aws s3 sync s3://${readBucketName()}/${appName}/.serverless .serverless --delete`,
            { stdio: "inherit" }
        );

        console.log("Deploying Serverless build.");
        execSync("npx serverless", { stdio: "inherit" });

        // .serverless directory will be populated at this point, so we should be able to read Lambda and CloudFront details
        console.log("Updating lambda to Node.js 12.x");

        const lambdaName = readLambdaName(appName);
        if (!lambdaName) {
            console.error("Lambda name is null.");
            process.exit(1);
        }

        console.log("Skipping updating lambda because Serverless does it.");
        // execSync(
        //   `aws lambda update-function-configuration --function-name ${lambdaName} --runtime nodejs12.x --region us-east-1`,
        //   { stdio: "inherit" }
        // );

        // Invalidate CloudFront caches if needed
        const cloudFrontId = readCloudFrontId(appName);
        if (!cloudFrontId) {
            console.error("CloudFront ID is null.");
            process.exit(1);
        }
        console.log("Invalidating CloudFront caches.");

        console.log("Skip invalidation since Serverless deployment does it.");

        // const paths = [
        //   "/*",
        // ];
        //
        // const pathsJoined = '"' + paths.join('" "') + '"';

        // execSync(
        //   `aws cloudfront create-invalidation --distribution-id ${cloudFrontId} --paths ${pathsJoined}`,
        //   { stdio: "inherit" }
        // );

        console.log("Syncing Serverless data back to S3.");
        execSync(
            `aws s3 sync .serverless s3://${readBucketName()}/${appName}/.serverless --delete`,
            { stdio: "inherit" }
        );
    } catch (error) {
        console.error("Error deploying Serverless deployment: " + error);
        process.exit(1);
    }
}

yargs
    .scriptName("deployer")
    .usage("$0 <cmd> [args]")
    .command(
        "deploy [filename]",
        "Deploy Serverless YAML file",
        (yargs: any) => {
            yargs.positional("filename", {
                type: "string",
                describe: "the file to deploy",
            });
        },
        function (argv: any) {
            deploy(argv.filename);
        }
    )
    .help().argv;