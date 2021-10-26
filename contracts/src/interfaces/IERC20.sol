// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

interface IERC20 {
  /// @notice ERC0 transfer tokens
  function transfer(address recipient, uint256 amount) external returns (bool);
  /// @notice ERC20 balance of address
  function balanceOf(address account) external view returns (uint256);
}