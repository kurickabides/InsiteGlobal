# CryptoRioMarket Production (SAP)- Pipe Line Notes
> This [document](https://faun.pub/how-to-host-your-static-website-with-s3-cloudfront-and-set-up-an-ssl-certificate-9ee48cd701f9) covers current base setup for the marketplace one page app
## CryptoRioMarket web Client S3 Buckets:
> This does not need a docker script we can just build a nodejs script with awscli and build files then copy build
folders to an AWS S3Bucket until a docker release is ready
- [www.cryptoriomarket.com](https://s3.console.aws.amazon.com/s3/buckets/www.cryptoriomarket.com?region=us-west-2&tab=objects) - this is were the static files are published
- [cryptoriomarket.com](https://s3.console.aws.amazon.com/s3/buckets/cryptoriomarket.com?region=us-west-2&tab=permissions) -this folder gets forwarded to the www folder
- 
### AWS Cloudfront, SSL Certs , , & Route 53 Setup
> there are two s3 Buckets created for this website
- [Route53](https://us-east-1.console.aws.amazon.com/route53/v2/hostedzones?region=us-east-1#ListRecordSets/Z054194221UCPHYRZ6OCM) stores dns settings for cryptoriomarket.com

> So the www S3 bucket must be configured correctlly to work with Cloudfront and to be able to Host the .wellKnown stellar file. We might host this from the polaris server but the first setup is with the market being the Host domain. I think we need to make CryoRio the stella home domain.
> Below covers current setup until changed 
> 


## CryoRIO django-polaris Server:
> Docker Build this will build our customized django-polaris server we will implment some of the rails these 
will work with client in order to interact with the stellar network