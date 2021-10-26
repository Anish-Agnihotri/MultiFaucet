# MultiFaucet

## About

MultiFaucet is a simple [faucet](https://en.wikipedia.org/wiki/History_of_bitcoin#Bitcoin_faucets) that drips `Ether/Matic`, `Wrapped Ether/Wrapped Matic`, `DAI Stablecoin`, and mints ERC721 NFTs to a recipient.

It enables a super operator to `drip` and `drain` to a recipient, add approved operators, or update the super operator. Approved operators can only `drip` to a recipient.

## Build and Test

```bash
# Collect repo
git clone https://github.com/anish-agnihotri/MultiFaucet
cd MultiFaucet/contracts

# Run tests
make
make test
```

## Installing the toolkit

If you do not have DappTools already installed, you'll need to run the commands below:

### Install Nix

```bash
# User must be in sudoers
curl -L https://nixos.org/nix/install | sh

# Run this or login again to use Nix
. "$HOME/.nix-profile/etc/profile.d/nix.sh"
```

### Install DappTools

```bash
curl https://dapp.tools/install | sh
```

## License

[GNU Affero GPL v3.0](https://github.com/Anish-Agnihotri/MultiFaucet/blob/master/LICENSE)

## Credits

- [@gakonst/lootloose](https://github.com/gakonst/lootloose) for DappTools info
- ds-test, OpenZeppelin for inherited libraries
