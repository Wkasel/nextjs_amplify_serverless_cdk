/* 
    use like so
    ---------
    >$ yarn write-configs '{"ApiStack":{"UserPoolClientId":"1hhg1mg4tbtdpa5tk4t1skal9","AppSyncAPIKey":"da2-qv65xpyzo5azliipjcb4brsgyy","UserPoolId":"us-east-1_UZShRL6LF","GraphQLAPIURL":"https://tm7qjopmn5f5voitvn5crmtnu4.appsync-api.us-east-1.amazonaws.com/graphql","ProjectRegion":"us-east-1"}}'
*/
function main() {
  try {
    const myArgs = process.argv.slice(2);
    const fs = require("fs");

    fs.writeFile("./cdk-exports-test.json", myArgs[0], function (e) {
      console.log(e);
    });
  } catch (e) {
    console.log(e);
  }
}
main();
