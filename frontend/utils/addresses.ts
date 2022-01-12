// Export faucet addresses
export const ADDRESSES = [
  {
    network: "ropsten",
    depleted: false,
    disclaimer: "Faucet is temporarily not dripping DAI.",
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
    depleted: false,
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
    depleted: true,
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
    depleted: false,
    disclaimer: "Faucet is temporarily not dripping DAI.",
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
    depleted: false,
    etherscanPrefix: "kovan-optimistic.etherscan.io",
    formattedName: "Optimistic Kovan",
    connectionDetails:
      "https://community.optimism.io/docs/infra/networks.html#optimistic-kovan",
    autoconnect: {
      chainId: "0x45",
      chainName: "Optimistic Kovan",
      nativeCurrency: {
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: ["https://kovan.optimism.io"],
      blockExplorerUrls: ["https://kovan-optimistic.etherscan.io/"],
    },
    addresses: {
      NFTs: "0xf5de760f2e916647fd766b4ad9e85ff943ce3a2b",
      wETH: "0xbc6f6b680bc61e30db47721c6d1c5cde19c1300d",
      DAI: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
    },
  },
  {
    network: "mumbai",
    depleted: true,
    disclaimer: "Temporary outage. Expected back by 1/12/2022.",
    etherscanPrefix: "mumbai.polygonscan.com",
    formattedName: "Polygon Mumbai",
    connectionDetails:
      "https://blog.pods.finance/guide-connecting-mumbai-testnet-to-your-metamask-87978071aca8",
    autoconnect: {
      chainId: "0x13881",
      chainName: "Polygon Mumbai",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
      rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
      blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    },
    addresses: {
      NFTs: "0xf5de760f2e916647fd766b4ad9e85ff943ce3a2b",
      wETH: "0x9c3c9283d3e44854697cd22d3faa240cfb032889",
      DAI: "0x001b3b4d0f3714ca98ba10f6042daebf0b1b7b6f",
    },
  },
  {
    network: "arb-rinkeby",
    depleted: true,
    disclaimer: "Faucet drips 100 DAI instead of 500 DAI.",
    etherscanPrefix: "testnet.arbiscan.io",
    formattedName: "Arbitrum Rinkeby",
    connectionDetails: "https://developer.offchainlabs.com/docs/public_testnet",
    autoconnect: {
      chainId: "0x66eeb",
      chainName: "Arbitrum Testnet",
      nativeCurrency: {
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: ["https://rinkeby.arbitrum.io/rpc"],
      blockExplorerUrls: ["https://testnet.arbiscan.io/"],
    },
    addresses: {
      NFTs: "0xf5de760f2e916647fd766b4ad9e85ff943ce3a2b",
      wETH: "0xebbc3452cc911591e4f18f3b36727df45d6bd1f9",
      DAI: "0x2f3c1b6a51a469051a22986aa0ddf98466cc8d3c",
    },
  },
  {
    network: "avalanche-fuji",
    depleted: false,
    disclaimer: "Faucet drips 0.1 AVAX and 0.1 wAVAX instead of ETH and wETH.",
    etherscanPrefix: "testnet.snowtrace.io",
    formattedName: "Avalanche Fuji",
    connectionDetails:
      "https://docs.avax.network/build/tutorials/smart-contracts/deploy-a-smart-contract-on-avalanche-using-remix-and-metamask#step-1-setting-up-metamask",
    autoconnect: {
      chainId: "0xa869",
      chainName: "Avalanche FUJI C-Chain",
      nativeCurrency: {
        name: "Avalanche",
        symbol: "AVAX",
        decimals: 18,
      },
      rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
      blockExplorerUrls: ["https://testnet.snowtrace.io/"],
    },
    addresses: {
      NFTs: "0xf5de760f2e916647fd766b4ad9e85ff943ce3a2b",
      wETH: "0xd00ae08403b9bbb9124bb305c09058e32c39a48c",
      DAI: "0xebbc3452cc911591e4f18f3b36727df45d6bd1f9",
    },
  },
];

/**
 * Export details about networks
 */
export function getAddressDetails() {
  // Get active networks
  const activeNetworks: string[] = ADDRESSES.filter(
    // Filter for non-depleted
    ({ depleted }) => !depleted
    // Collect just formatted name
  ).map(({ formattedName }) => formattedName);
  // Get number of active networks
  const networkCount: number = activeNetworks.length;

  // Generate string for active networks
  // "X, Y, and Z..."
  const last: string | undefined = activeNetworks.pop();
  const activeString: string = activeNetworks.join(", ") + " and " + last;

  // Sort addresses (depleted last)
  const sortedAddresses = ADDRESSES.sort((a, b) => {
    const first = a.depleted ?? false;
    const second = b.depleted ?? false;
    return Number(first) - Number(second);
  });

  // Return details
  return { networkCount, activeString, sortedAddresses };
}
