# Frontend

## About

Frontend to accompany [MultiFaucet contracts](https://github.com/alt-research/alt-contracts/tree/feat/faucet-contract/contracts/faucet). Authenticates user with Twitter OAuth, stores claim for 24h in Redis, calls drip function on contract.

## Env
| - | - |
| --- | --- |
| REDIS_URL | Redis connection URI |
| NEXTAUTH_URL | site base URL, eg. http://localhost:3000 |
| NEXTAUTH_JWT_SECRET | any string  |
| TWITTER_CLIENT_ID | [Consumer key](https://developer.twitter.com/en/portal/projects/1596429959400402946/apps/26149609/keys). Don't regenerate easily, will influence all projects |
| TWITTER_CLIENT_SECRET | [Consumer secret](https://developer.twitter.com/en/portal/projects/1596429959400402946/apps/26149609/keys) |
| OPERATOR_ADDRESS | account which deployed multi-faucet contract |
| OPERATOR_PRIVATE_KEY | private key of account which deployed multi-faucet contract  |
| SLACK_CHANNEL | as-is |
| SLACK_ACCESS_TOKEN | as-is |
| ADMIN_KEY | key to verify user who do some restrict calls |

## Run locally
```bash
# run Redis
docker pull redis:latest
docker run -itd --name redis-test -p 6379:6379 redis

# Install dependencies
yarn install

# Update environment variables
cp .env.sample .env.local
vim .env.local

# Run
yarn dev
```

## Deployment

``` bash
# run Redis
docker pull redis:latest
docker run -itd --name redis-test -p 6379:6379 redis

yarn install

cp .env.sample .env
vim .env

yarn build
yarn start
```

## API
### Add networks
``` 
curl 'http://localhost:3000/api/network/' -X POST -H 'content-type: application/json' --data-raw '
  "key": ${admin_key},
  "networks": [
    {
      "chainId": "9990",
      "faucetContractAddress": "0xca1ba94a91B6549d67B475Db88c3e035c5958B5a",
      "rpc": "https://devnet-rpc.altlayer.io/"
    }
  ]
'
```

### Update networks
``` 
curl 'http://localhost:3000/api/network/' -X PUT -H 'content-type: application/json' --data-raw '
  "key": ${admin_key},
  "networks": [
    {
      "chainId": "9990",
      "faucetContractAddress": "0xca1ba94a91B6549d67B475Db88c3e035c5958B5a",
      "rpc": "https://devnet-rpc.altlayer.io/"
    }
  ]
'
```

### Get networks
``` 
curl 'http://localhost:3000/api/network/'
```