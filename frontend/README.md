# Frontend

## About

Frontend to accompany [MultiFaucet contracts](https://github.com/alt-research/alt-contracts/tree/feat/faucet-contract/contracts/faucet). Authenticates user with Twitter OAuth, stores claim for 24h in Redis, calls drip function on contract.

## Run locally

```bash
# Install dependencies
yarn install

# Update environment variables
cp .env.sample .env.local
vim .env.local

# Run
yarn dev
```

## Development
```
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
