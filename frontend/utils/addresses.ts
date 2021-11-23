// Export faucet addresses
export const ADDRESSES = [
  {
    network: "ropsten",
    etherscanPrefix: "ropsten.etherscan.io",
    formattedName: "Ropsten",
    addresses: {
      NFTs: "0xf5de760f2e916647fd766b4ad9e85ff943ce3a2b",
      wETH: "0xc778417e063141139fce010982780140aa0cd5ab",
      DAI: "0x31f42841c2db5173425b5223809cf3a38fede360",
    },
  },
  {
    network: "kovan",
    etherscanPrefix: "kovan.etherscan.io",
    formattedName: "Kovan",
    addresses: {
      NFTs: "0xf5de760f2e916647fd766b4ad9e85ff943ce3a2b",
      wETH: "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
      DAI: "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa",
    },
  },
  {
    network: "rinkeby",
    disclaimer: "Faucet drips 100 DAI instead of 500 DAI.",
    etherscanPrefix: "rinkeby.etherscan.io",
    formattedName: "Rinkeby",
    addresses: {
      NFTs: "0xf5de760f2e916647fd766b4ad9e85ff943ce3a2b",
      wETH: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
      DAI: "0x6A9865aDE2B6207dAAC49f8bCba9705dEB0B0e6D",
    },
  },
  {
    network: "goerli",
    etherscanPrefix: "goerli.etherscan.io",
    formattedName: "Görli",
    addresses: {
      NFTs: "0xf5de760f2e916647fd766b4ad9e85ff943ce3a2b",
      wETH: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
      DAI: "0x11fe4b6ae13d2a6055c8d9cf65c55bac32b5d844",
    },
  },
  {
    network: "kovan-optimistic",
    etherscanPrefix: "kovan-optimistic.etherscan.io",
    formattedName: "Optimistic Kovan",
    connectionDetails:
      "https://community.optimism.io/docs/infra/networks.html#optimistic-kovan",
    addresses: {
      NFTs: "0xf5de760f2e916647fd766b4ad9e85ff943ce3a2b",
      wETH: "0xbc6f6b680bc61e30db47721c6d1c5cde19c1300d",
      DAI: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
    },
  },
  {
    network: "mumbai",
    disclaimer: "Faucet drips MATIC and wMATIC instead of ETH and wETH.",
    etherscanPrefix: "mumbai.polygonscan.com",
    formattedName: "Polygon Mumbai",
    connectionDetails:
      "https://blog.pods.finance/guide-connecting-mumbai-testnet-to-your-metamask-87978071aca8",
    addresses: {
      NFTs: "0xf5de760f2e916647fd766b4ad9e85ff943ce3a2b",
      wETH: "0x9c3c9283d3e44854697cd22d3faa240cfb032889",
      DAI: "0x001b3b4d0f3714ca98ba10f6042daebf0b1b7b6f",
    },
  },
  {
    network: "arb-rinkeby",
    disclaimer: "Faucet drips 100 DAI instead of 500 DAI.",
    etherscanPrefix: "testnet.arbiscan.io",
    formattedName: "Arbitrum Rinkeby",
    connectionDetails: "https://developer.offchainlabs.com/docs/public_testnet",
    addresses: {
      NFTs: "0xf5de760f2e916647fd766b4ad9e85ff943ce3a2b",
      wETH: "0xebbc3452cc911591e4f18f3b36727df45d6bd1f9",
      DAI: "0x2f3c1b6a51a469051a22986aa0ddf98466cc8d3c",
    },
  },
  {
    network: "avalanche-fuji",
    disclaimer: "Faucet drips 0.1 AVAX and 0.1 wAVAX instead of ETH and wETH.",
    etherscanPrefix: "testnet.snowtrace.io",
    formattedName: "Avalanche Fuji",
    connectionDetails:
      "https://docs.avax.network/build/tutorials/smart-contracts/deploy-a-smart-contract-on-avalanche-using-remix-and-metamask#step-1-setting-up-metamask",
    addresses: {
      NFTs: "0xf5de760f2e916647fd766b4ad9e85ff943ce3a2b",
      wETH: "0xd00ae08403b9bbb9124bb305c09058e32c39a48c",
      DAI: "0xebbc3452cc911591e4f18f3b36727df45d6bd1f9",
    },
  },
];
