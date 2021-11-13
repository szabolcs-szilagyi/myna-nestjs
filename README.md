# MYNA

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
   AWS_ACCESS_KEY_ID=`aws configure get aws_access_key_id` \
   AWS_SECRET_ACCESS_KEY=`aws configure get aws_secret_access_key` \
   acme.sh --issue -d '*.mynalabel.com' -d mynalabel.com --dns dns_aws
   ```
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
4. change CloudFront to use the new cert via the web ui - `https://console.aws.amazon.com/cloudfront/v3/home?#/distributions/E3QL6B6GNJEOCC`
