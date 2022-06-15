#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import type { DeptDashStackProps } from "@deptdash/cdk-webapp";
import { DeptDashStack, BastionStack } from "@deptdash/cdk-webapp";
import type { Environment } from "aws-cdk-lib";
import { ContainerImage } from "aws-cdk-lib/aws-ecs";
import * as path from "path";
const mainProjectPackage = require("../../package.json");

// TODO: update remix.init/index.js to set this at clone-time.
// We should avoid assuming the account is ours.
// Get account number by running `aws sts get-caller-identity`
const env: Environment = {
  account: "320049641071",
  region: "us-west-1",
};

const projectName = "ppre";
if (mainProjectPackage.name !== projectName) {
  console.error(`It looks like you've changed the name of your project in package.json. The package.json name is assumed to match the CDK stack name.

Changing a CDK stack name will fail to deploy (in the best case) or might delete your production db (in a worse case).

Delete this check if you're sure you know what you're about, but also update:
- .github/workflows/main.yml, the "inspect-env" step.
- scripts/tunnel-db, the "baseStackName" function.

You can also reach out to the DEPT Dash team for help understanding the ramifications of this change.
`);
  process.exit(1);
}
const app = new cdk.App();

// Staging stage
const stagingProps: DeptDashStackProps = {
  env,
  projectName,
  stage: "staging",
  database: true,
  image: ContainerImage.fromAsset(path.resolve(__dirname, "../..")),

  // replace these values with a domain you own, or use manual certificate validation
  certificateValidation: "route53",
  route53HostedZoneDomain: "deptdxp.com",
  domainName: "staging.ppre.deptdxp.com",
};
new DeptDashStack(app, stagingProps);
// create a bastion host in a separate stack, so it can be torn down
// when not in use.
new BastionStack(app, stagingProps);

// Prod stage
const prodProps: DeptDashStackProps = {
  env,
  projectName,
  stage: "production",
  database: true,
  image: ContainerImage.fromAsset(path.resolve(__dirname, "../..")),

  // replace these values with a domain you own, or use manual certificate validation
  certificateValidation: "route53",
  route53HostedZoneDomain: "deptdxp.com",
  domainName: "ppre.deptdxp.com",
};

new DeptDashStack(app, prodProps);
// create a bastion host in a separate stack, so it can be torn down
// when not in use.
new BastionStack(app, prodProps);
