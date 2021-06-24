import * as cdk from "@aws-cdk/core";
import { Duration } from "@aws-cdk/core";
import { NextJSLambdaEdge } from "@sls-next/cdk-construct";
import { Runtime } from "@aws-cdk/aws-lambda";
import 'source-map-support/register';
import { Builder } from "@sls-next/lambda-at-edge";



export class NextStack extends cdk.Stack {
    public exportData: any;
    constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);
        const stack = new NextJSLambdaEdge(this, "NextJsApp", {
            serverlessBuildOutDir: "./build",
            runtime: Runtime.NODEJS_12_X,
            memory: 1024,
            timeout: Duration.seconds(30),
            withLogging: true,
        });

        const data = {
            arecord: stack.aRecord?.domainName,
            bucket: stack.bucket?.bucketDomainName,
            distribution: stack.distribution.domainName,
            domain: stack.distribution.distributionDomainName,
            edgeLambdaRole: stack.edgeLambdaRole.roleName
        };

        stack.bucket.bucketArn
        new cdk.CfnOutput(this, "CFDistro", {
            value: stack.distribution.domainName,
            exportName: "CFDistro"
        });

        new cdk.CfnOutput(this, "CFData", {
            value: JSON.stringify(data),
            exportName: "CFData"
        });



    }
}

export class ComposedNextStack extends cdk.Stack {
    private builder: any;
    public stack: any;
    constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props)

        this.builder = new Builder(".", "./build", { args: ['build'] })
        this.builder.build(true).then(() => {
            this.stack = new NextStack(scope, `${id}-base`, {
                env: {
                    region: 'us-east-1'
                },
                analyticsReporting: true,
                description: "Testing deploying NextJS Serverless Construct",
                ...props
            });


        });

        // new cdk.CfnOutput(this, "UserPoolClientId", {
        //     value: ,
        //     exportName: "UserPoolClientId"
        // });


    }
}