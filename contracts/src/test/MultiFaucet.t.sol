// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

/// ============ Imports ============

import "./utils/MultiFaucetTest.sol"; // MultiFaucet ds-test

/// ============ Libraries ============

library Errors {
    string constant NotSuperOperator = 'Not super operator';
    string constant NotApprovedOperator = 'Not approved operator';
}

/// ============ Functionality testing ============

contract Tests is MultiFaucetTest {
    /// @notice Allow dripping to recipient, if super operator
    function testDrip() public {
        // Bob before balances
        uint256 bobETHBalanceBefore = BOB.ETHBalance();
        uint256 bobDAIBalanceBefore = BOB.DAIBalance();
        uint256 bobWETHBalanceBefore = BOB.WETHBalance();
        uint256 bobNFTCountBefore = BOB.NFTBalance();

        // Alice drips to bob
        ALICE.drip(address(BOB));

        // Bob after balances
        assertEq(BOB.ETHBalance(), bobETHBalanceBefore + 5 ether);
        assertEq(BOB.DAIBalance(), bobDAIBalanceBefore + 5_000e18);
        assertEq(BOB.WETHBalance(), bobWETHBalanceBefore + 5e18);
        assertEq(BOB.NFTBalance(), bobNFTCountBefore + 5);
    }

    /// @notice Prevent dripping if not approved operator
    function testCannotDripIfNotOperator() public {
        assertErrorFunctionWithAddress(
            BOB.drip,
            address(ALICE),
            Errors.NotApprovedOperator
        );
    }

    /// @notice Can add approved operator and they can drip
    function testAddApprovedOperator() public {
        // Alice adds Bob as approved operator
        ALICE.updateApprovedOperator(address(BOB), true);

        // Ensure Bob is an approved operator
        assertTrue(FAUCET.approvedOperators(address(BOB)));

        // Ensure Bob can drip
        BOB.drip(address(ALICE));
    }

    /// @notice Can remove approved operator and they can't drip
    function testRemoveApprovedOperator() public {
        // Alice adds Bob as approved operator
        ALICE.updateApprovedOperator(address(BOB), true);
        assertTrue(FAUCET.approvedOperators(address(BOB)));

        // Alice removes Bob as approved operator
        ALICE.updateApprovedOperator(address(BOB), false);
        assertTrue(!FAUCET.approvedOperators(address(BOB)));

        // Bob can no longer drip
        assertErrorFunctionWithAddress(
            BOB.drip,
            address(ALICE),
            Errors.NotApprovedOperator
        );
    }

    /// @notice Can update super operator
    function testUpdateSuperOperator() public {
        // Alice gives up super operatorship to BOB
        ALICE.updateSuperOperator(address(BOB));

        // Verify Bob is now super operator
        assertEq(FAUCET.superOperator(), address(BOB));

        // Alice can no longer drip
        assertErrorFunctionWithAddress(
            ALICE.drip,
            address(BOB),
            Errors.NotApprovedOperator
        );

        // Bob can add Alice to super operators
        BOB.updateApprovedOperator(address(ALICE), true);
        assertTrue(FAUCET.approvedOperators(address(ALICE)));

        // Alice can now drip
        ALICE.drip(address(BOB));

        // Alice can still not update super operator
        assertErrorFunctionWithAddress(
            ALICE.updateSuperOperator,
            address(ALICE),
            Errors.NotSuperOperator
        );
    }
    
    /// @notice Can drain contract if super operator
    function testCanDrainFaucet() public {
        // Bob before balances
        uint256 bobETHBalanceBefore = BOB.ETHBalance();
        uint256 bobDAIBalanceBefore = BOB.DAIBalance();
        uint256 bobWETHBalanceBefore = BOB.WETHBalance();

        // Alice drains to bob
        ALICE.drain(address(BOB));

        // Bob after balances
        assertEq(BOB.ETHBalance(), bobETHBalanceBefore + 100 ether);
        assertEq(BOB.DAIBalance(), bobDAIBalanceBefore + 100_000e18);
        assertEq(BOB.WETHBalance(), bobWETHBalanceBefore + 100e18);
    }

    /// @notice Cannot drain contract if not super operator
    function testCannotDrainIfNotSuperOperator() public {
        assertErrorFunctionWithAddress(
            BOB.drain,
            address(BOB),
            Errors.NotSuperOperator
        );
    }

    /// @notice Returns correct number of available drips
    function testCorrectDripCount() public {
        (uint256 ethDrips, uint256 daiDrips, uint256 wethDrips)
            = FAUCET.availableDrips();
        assertEq(ethDrips, 20);
        assertEq(daiDrips, 20);
        assertEq(wethDrips, 20);
    }
}