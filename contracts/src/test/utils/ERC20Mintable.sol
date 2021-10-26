// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

/// ============ Imports ============

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol"; // OZ: ERC20

/// @title ERC20Mintable
/// @author Anish Agnihotri
/// @notice Exposes ERC20 minting as external function
contract ERC20Mintable is ERC20 {
    // Initialize ERC20
    constructor(
        string memory name_, 
        string memory symbol_
    ) ERC20(name_, symbol_) {}

    /// @notice Expose ERC20 minting as external function
    /// @param account to mint to
    /// @param amount to mint
    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
}