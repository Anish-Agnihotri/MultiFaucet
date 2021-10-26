// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

/// ============ Imports ============

import "ds-test/test.sol"; // ds-test
import "./MultiFaucetUser.sol"; // Faucet user
import "../../MultiFaucet.sol"; // MultiFaucet
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol"; // OZ: ERC20

contract MultiFaucetTest is DSTest {

    /// ============ Storage ============

    ERC20 internal DAI;
    ERC20 internal WETH;
    MultiFaucet internal FAUCET;
    MultiFaucetUser internal ALICE;
    MultiFaucetUser internal BOB;

    /// ============ Setup test suite ============

    function setUp() public virtual {
        // Setup tokens
        DAI = new ERC20("DAI Stablecoin", "DAI");
        WETH = new ERC20("Wrapped Ether", "wETH");

        // Create faucet
        FAUCET = new MultiFaucet(address(DAI), address(WETH));

        // Fund faucet
        payable(address(FAUCET)).call{value: 100 ether}("");
        DAI._mint(address(FAUCET), 10_000e18);
        WETH._mint(address(FAUCET), 100e18);

        // Setup faucet users
        ALICE = new MultiFaucetUser(FAUCET, address(DAI), address(WETH));
        BOB = new MultiFaucetUser(FAUCET, address(DAI), address(WETH));

        // Make Alice superOperator
        FAUCET.updateSuperOperator(address(ALICE));
    }
}