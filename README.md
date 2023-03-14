# MYNA

Finito. This site was an interesting challenge for me. The old backend was
written by someone else in PHP and when I took the old mynalabel.com webshop
over I didn't wanted to maintain that code base. So I re-wrote it from scratch
using NestJS.

The front-end code can be seen in the [myna-nextjs](https://github.com/szabolcs-szilagyi/myna-nextjs) repository, for that I've
continued with the React based NextJS framework, after doing a through re-work
on it.

The third challange in this whole story for me was Cypress. This was the first
project, where I've used it. I must admit that tool is awesome!

All these three frameworks / tools were new to me at the time I started it,
tried my best to learn them as much as I could.

Now I'm sharing this codebase as a reference, maybe it can help the lone
traveller on their journey through development.

P.S. there are lots of out-of-the-box solutions for webshops, don't hand-roll
your own. I've only continued to develop this as it was stared by someone else
before me. While I enjoyed to learn all this, I could have saved a lot of work
and nerves if I would push for a ready solution and "just" apply the style of
this page over there.

## Install heroku-cli

```
cd ~
wget https://cli-assets.heroku.com/heroku-linux-x64.tar.gz
tar zxvf heroku-linux-x64.tar.gz
alias heroku=~/heroku/bin/heroku
```

## Cert upload

To upload certificate to AWS one need to prepare the "fullchain": for AWS it
should not contain the immediate cert, just the intermediate and root cert!

https://building.vts.com/blog/2015/11/02/route53-ssl-naked-domain-redirect/


Steps:
1. get new cert:
   ```
   asp user-aws-profile && \
   AWS_ACCESS_KEY_ID=`aws configure get aws_access_key_id` \
   AWS_SECRET_ACCESS_KEY=`aws configure get aws_secret_access_key` \
   acme.sh --issue -d '*.mynalabel.com' -d mynalabel.com --dns dns_aws
   ```
   2022-08-03 - had to add the `--force` flag
2. install new cert on heroku
   ```
   # staging
   heroku certs:add ~/.acme.sh/\*.mynalabel.com/fullchain.cer ~/.acme.sh/\*.mynalabel.com/\*.mynalabel.com.key --app myna-nextjs-staging
   heroku certs:add ~/.acme.sh/\*.mynalabel.com/fullchain.cer ~/.acme.sh/\*.mynalabel.com/\*.mynalabel.com.key --app mynalabel-staging
   # production
   heroku certs:add ~/.acme.sh/\*.mynalabel.com/fullchain.cer ~/.acme.sh/\*.mynalabel.com/\*.mynalabel.com.key --app mynalabel-production
   heroku certs:add ~/.acme.sh/\*.mynalabel.com/fullchain.cer ~/.acme.sh/\*.mynalabel.com/\*.mynalabel.com.key --app myna-nextjs-production
   ```
3. install cert on cloudfront
   ```
   aws iam upload-server-certificate \
     --server-certificate-name mynalabel_com_`date +%Y-%m-%d`  \
     --certificate-body file:///home/szabi/.acme.sh/\*.mynalabel.com/\*.mynalabel.com.cer \
     --private-key file:///home/szabi/.acme.sh/\*.mynalabel.com/\*.mynalabel.com.key \
     --certificate-chain file:///home/szabi/.acme.sh/\*.mynalabel.com/ca.cer \
     --path /cloudfront/myna/
   ```
4. change CloudFront to use the new cert via the web ui -
   `https://console.aws.amazon.com/cloudfront/v3/home?#/distributions/E3QL6B6GNJ3OCC`

## TypeORM migrations

Create a new migration plan run:
```sh
npm run typeorm:create <name_of_migration>
```

Run migration on the `development` env just issue:
```sh
npm run typeorm:run
```

Rollback the last migration will be:
```sh
npm run typeorm:revert
```

For running the migrations on other env. than `development` you will have to
prepend `NODE_ENV=<env_name>` to the command. E.g. run migration on staging:
```sh
NODE_ENV=staging npm run typeorm:run
```

To simply query the migrations that are registered in the database (meaning they
already ran) you can run direct queries via the TypeORM cli:
```sh
npm run typeorm query 'select * from migrations'
```

Alternatively TypeORM is able to list migration that were ran:
```sh
npm run typeorm:show
```
