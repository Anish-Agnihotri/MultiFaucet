// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

/// ============ Imports ============

import "./DSTestExtended.sol"; // DSTestExtended
import "./ERC20Mintable.sol"; // ERC20Mintable
import "./MultiFaucetUser.sol"; // Faucet user
import "../../MultiFaucet.sol"; // MultiFaucet

contract MultiFaucetTest is DSTestExtended {

    /// ============ Storage ============

    /// @dev DAI token
    ERC20Mintable internal DAI;
    /// @dev wETH token
    ERC20Mintable internal WETH;
    /// @dev MultiFaucet contract
    MultiFaucet internal FAUCET;
    /// @dev User: Alice (default super operator)
    MultiFaucetUser internal ALICE;
    /// @dev User: Bob
    MultiFaucetUser internal BOB;

    /// ============ Setup test suite ============

    function setUp() public virtual {
        // Setup tokens
        DAI = new ERC20Mintable("DAI Stablecoin", "DAI");
        WETH = new ERC20Mintable("Wrapped Ether", "wETH");

        // Create faucet
        FAUCET = new MultiFaucet(address(DAI), address(WETH), "https://test.com");

        // Fund faucet
        (bool success, ) = payable(address(FAUCET)).call{value: 100 ether}("");
        require(success, "Failed funding faucet with ETH");
        DAI.mint(address(FAUCET), 100_000e18);
        WETH.mint(address(FAUCET), 100e18);

        // Setup faucet users
        ALICE = new MultiFaucetUser(FAUCET, address(DAI), address(WETH));
        BOB = new MultiFaucetUser(FAUCET, address(DAI), address(WETH));

        // Make Alice superOperator
        FAUCET.updateSuperOperator(address(ALICE), true);
    }
}