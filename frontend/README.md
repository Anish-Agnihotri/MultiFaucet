# Frontend

## About

Frontend to accompany [MultiFaucet contracts](https://github.com/Anish-Agnihotri/faucet.sh/tree/master/contracts). Authenticates user with Twitter OAuth, stores claim for 24h in Redis, calls drip function on contract.

## Run locally

```bash
# Install dependencies
npm install

# Update environment variables
cp .env.sample .env.local
vim .env.local

# Run
npm run dev
```

## License

[GNU Affero GPL v3.0](https://github.com/Anish-Agnihotri/faucet.sh/blob/master/LICENSE)
