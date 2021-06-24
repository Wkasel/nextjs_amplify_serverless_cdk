#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { TestBackendStack } from './lib/test-backend-stack';
import { ComposedNextStack } from './lib/next-frontend-stack';
import * as fs from 'fs';


const app = new cdk.App();
new TestBackendStack(app, 'ApiStack');
new ComposedNextStack(app, 'ComposedNextStack', {});




// const builder = new Builder(".", "./build", { args: ['build'] });
// builder
//     .build(true)
//     .then(() => {
//         const app = new cdk.App();
//         const { GraphQLAPIURL, AppSyncAPIKey, ProjectRegion, UserPoolId, UserPoolClientId } = api.exportData;
//         new NextStack(app, "NextJsStack", {
//             env: {
//                 region: 'us-east-1',


//             },
//             analyticsReporting: true,
//             description: "Testing deploying NextJS Serverless Construct"
//         });
//     })
//     .catch((e) => {
//         console.error(e);
//         process.exit(1);
//     });




// app.synth()