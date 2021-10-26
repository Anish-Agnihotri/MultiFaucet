// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

/// ============ Imports ============

import "ds-test/test.sol"; // ds-test

/// @title DSTestExtended
/// @author Anish Agnihotri
/// @notice Extends DSTest with more generic assertions for revert checks
contract DSTestExtended is DSTest {
    /// @notice Calls function and checks for matching revert message
    /// @param erroringFunction to call
    /// @param param to pass to function
    /// @param message to check against revert error string
    function assertErrorFunctionWithAddress(
        function(address) external erroringFunction,
        address param,
        string memory message
    ) internal {
        try erroringFunction(param) { 
            fail();
        } catch Error(string memory error) {
            // Assert revert error matches expected message
            assertEq(error, message);
        }
    }

    /// @notice Calls function and checks for matching revert message
    /// @param erroringFunction to call
    /// @param _addr to pass to function
    /// @param _bool bool to pass to function
    /// @param message to check against revert error string
    function assertErrorFunctionWithAddressAndBool(
        function(address, bool) external erroringFunction,
        address _addr,
        bool _bool,
        string memory message
    ) internal {
        try erroringFunction(_addr, _bool) { 
            fail();
        } catch Error(string memory error) {
            // Assert revert error matches expected message
            assertEq(error, message);
        }
    }
}