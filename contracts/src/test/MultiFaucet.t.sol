// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

/// ============ Imports ============

import "./utils/MultiFaucetTest.sol"; // MultiFaucet ds-test

/// ============ Libraries ============

library URIs {
    string constant defaultURI = 'https://test.com';
    string constant alternativeURI = 'https://alternative.com';
}

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

        // Check token uris
        for (uint256 i = 1; i <= 5; i++) {
            assertEq(FAUCET.tokenURI(i), URIs.defaultURI);
        }
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
        // Alice gives super operatorship to BOB
        ALICE.updateSuperOperator(address(BOB), true);

        // Verify Bob is now a super operator
        assertTrue(FAUCET.superOperators(address(BOB)));

        // Alice removes her super operatorship
        ALICE.updateSuperOperator(address(ALICE), false);

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
        assertErrorFunctionWithAddressAndBool(
            ALICE.updateSuperOperator,
            address(ALICE),
            true,
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

    /// @notice Allows super operator to update collection URI
    function testAllowsUpdatingURI() public {
        // Drip to Bob
        ALICE.drip(address(BOB));

        // Ensure old URI for bobs tokens
        for (uint256 i = 1; i <= 5; i++) {
            assertEq(FAUCET.tokenURI(i), URIs.defaultURI);
        }

        // Update URI
        ALICE.updateTokenURI(URIs.alternativeURI);

        // Drip to Bob
        ALICE.drip(address(BOB));

        // Ensure new URI for bobs tokens
        for (uint256 i = 1; i <= 10; i++) {
            assertEq(FAUCET.tokenURI(i), URIs.alternativeURI);
        }
    }

    /// @notice Allows super operators to update drip amounts
    function testAllowsUpdatingDripAmounts() public {
        // Bob before balances
        uint256 bobETHBalanceBefore = BOB.ETHBalance();
        uint256 bobDAIBalanceBefore = BOB.DAIBalance();
        uint256 bobWETHBalanceBefore = BOB.WETHBalance();
        uint256 bobNFTCountBefore = BOB.NFTBalance();

        // Alice updates drip amounts
        ALICE.updateDripAmounts(1, 1e18, 1000e18, 1e18);

        // Alice drips to bob
        ALICE.drip(address(BOB));

        // Bob after balances
        assertEq(BOB.ETHBalance(), bobETHBalanceBefore + 1 ether);
        assertEq(BOB.DAIBalance(), bobDAIBalanceBefore + 1_000e18);
        assertEq(BOB.WETHBalance(), bobWETHBalanceBefore + 1e18);
        assertEq(BOB.NFTBalance(), bobNFTCountBefore + 1);
    }
}