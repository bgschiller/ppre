# CDK

## Setup

Set up configuration options in `bin/cdk.ts`.

Add parameters to AWS Parameter Store as a `SecureString` for each environment variable for the container. The format is: `/dept-dash/${projectName}/${stage}/environment`.

Run `cdk bootstrap aws://ACCOUNT-NUMBER/REGION`.

### Manual certificates

For a `certificateValidation` of `manual`, you need to create two certificates in AWS Certificate Manager manually before deploying the stack:

1. One matching `domainName` in the `us-east-1` region. Even if you're deploying to a different region, this one must be in `us-east-1` because Cloudfront requires it.
2. One matching `loadBalancerDomainName` in the region you're deploying to.

Once that's done, enter the certificates ARN's in `bin/cdk.ts` as `cloudfrontCertificateARN` and `loadBalancerCertificateARN`.

## Deploy

Run `cdk deploy <stack>`

So for the `staging` stage, `npm run cdk deploy DeptDash-ppre-staging`

### Common problems

#### Container doesn't start

If the container doesn't come up in prod, CDK (via CloudFormation) will remain waiting on the deployment as it tries to spin up new containers. This is generally good, in that it keeps the old running container serving traffic, and will eventually time out and rollback. Oftentimes you don't want to wait several hours for CloudFormation to time out though, in which case:

1. Log in to AWS.
2. Go to the CloudFormation console.
3. Click in to your stack (something like `DeptDash-ppre-production`).
4. Click `Stack actions` in the top right, and click `Cancel update stack`. Confirm it.
5. CloudFormation will roll the update back, and your CI job will finish (as a failure) once the rollback is done.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
