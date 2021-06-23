import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as NextBackend from '../lib/test-backend-stack';

test('Empty Stack', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new NextBackend.TestBackendStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(matchTemplate({
    "Resources": {}
  }, MatchStyle.EXACT))
});
