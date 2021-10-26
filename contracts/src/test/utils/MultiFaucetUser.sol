// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

/// ============ Imports ============

import "../../MultiFaucet.sol"; // MultiFaucet
import "../../interfaces/IERC20.sol"; // ERC20 minified interface
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol"; // OZ: ERC721 recipient

/// @title MultiFaucetUser
/// @author Anish Agnihotri
/// @notice Mock user to test interacting with MultiFaucet
contract MultiFaucetUser is ERC721Holder {

    /// ============ Immutable storage ============

    /// @dev DAI contract
    IERC20 immutable internal DAI;
    /// @dev wETH contract
    IERC20 immutable internal WETH;
    /// @dev Faucet contract
    MultiFaucet immutable internal FAUCET;

    /// ============ Constructor ============

    /// @notice Creates a new MultiFaucetUser
    /// @param _DAI contract address
    /// @param _WETH contract address
    /// @param _FAUCET contract
    constructor(MultiFaucet _FAUCET, address _DAI, address _WETH) {
        DAI = IERC20(_DAI);
        WETH = IERC20(_WETH);
        FAUCET = _FAUCET;
    }

    /// ============ Helper functions ============

    /// @notice Returns ETH balance of user
    function ETHBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Returns DAI balance of user
    function DAIBalance() public view returns (uint256) {
        return DAI.balanceOf(address(this));
    }

    /// @notice Returns wETH balance of user
    function WETHBalance() public view returns (uint256) {
        return WETH.balanceOf(address(this));
    }

    /// @notice Returns NFT count of user
    function NFTBalance() public view returns (uint256) {
        return FAUCET.balanceOf(address(this));
    }

    /// ============ Inherited Functionality ============

    /// @notice Drips from faucet to recipient
    /// @param _recipient to drip to
    function drip(address _recipient) public {
        FAUCET.drip(_recipient);
    }

    /// @notice Drains faucet to a recipient address
    /// @param _recipient to drain to
    function drain(address _recipient) public {
        FAUCET.drain(_recipient);
    }

    /// @notice Adds or removes approved operator
    /// @param _operator address
    /// @param _status to update for operator (true == allowed to drip)
    function updateApprovedOperator(
        address _operator, 
        bool _status
    ) public {
        FAUCET.updateApprovedOperator(_operator, _status);
    }

    /// @notice Updates super operator
    /// @param _operator new super operator address
    function updateSuperOperator(address _operator) public {
        FAUCET.updateSuperOperator(_operator);
    }

    /// @notice Updates token collection URI
    /// @param _URI new collection URI
    function updateTokenURI(string memory _URI) public {
        FAUCET.updateTokenURI(_URI);
    }

    /// @notice Allows receiving ETH
    receive() external payable {}
}