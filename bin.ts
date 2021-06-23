#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { TestBackendStack } from './lib/test-backend-stack';
import { Builder } from "@sls-next/lambda-at-edge";
import { NextStack } from "./lib/next-frontend-stack";


const app = new cdk.App();
// new TestBackendStack(app, 'ApiStack');



const builder = new Builder(".", "./build", { args: ['build'] });

builder
    .build(true)
    .then(() => {
        const app = new cdk.App();
        new NextStack(app, "NextJsStack", {
            env: {
                region: 'us-east-1',
            },
            analyticsReporting: true,
            description: "Testing deploying NextJS Serverless Construct"
        });
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });