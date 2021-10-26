// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

/// ============ Imports ============

import "./interfaces/IERC20.sol"; // ERC20 minified interface
import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; // OZ: ERC721

/// @title MultiFaucet
/// @author Anish Agnihotri
/// @notice Drips ETH, DAI, wETH, and mints NFTs
contract MultiFaucet is ERC721 {

    /// ============ Immutable storage ============

    /// @notice DAI ERC20 token
    IERC20 public immutable DAI;
    /// @notice wETH ERC20 token
    IERC20 public immutable WETH;
    /// @notice Number of ERC721 NFTs to mint
    uint256 public constant NFT_COUNT = 5;
    /// @notice ETH to disperse
    uint256 public constant ETH_AMOUNT = 5 ether;
    /// @notice DAI to disperse
    uint256 public constant DAI_AMOUNT = 5_000e18;
    /// @notice wETH to disperse
    uint256 public constant WETH_AMOUNT = 5e18;

    /// ============ Mutable storage ============

    /// @notice Count of minted NFTs
    uint256 public nftsMinted;
    /// @notice Address of faucet super operator
    address public superOperator;
    /// @notice Addresses of approved faucet operators
    mapping(address => bool) public approvedOperators;

    /// ============ Modifiers ============

    /// @notice Requires sender to be contract super operator
    modifier isSuperOperator() {
        // Ensure sender is super operator
        require(msg.sender == superOperator, "Not super operator");
        _;
    }

    /// @notice Requires sender to be contract approved operator
    modifier isApprovedOperator() {
        // Ensure sender is in approved operators or is super operator
        require(
            approvedOperators[msg.sender] || superOperator == msg.sender, 
            "Not approved operator"
        );
        _;
    }

    /// ============ Events ============

    /// @notice Emitted after faucet drips to a recipient
    /// @param recipient address dripped to
    event FaucetDripped(address indexed recipient);

    /// @notice Emitted after faucet drained to a recipient
    /// @param recipient address drained to
    event FaucetDrained(address indexed recipient);

    /// @notice Emitted after operator status is updated
    /// @param operator address being updated
    /// @param status new operator status
    event OperatorUpdated(address indexed operator, bool status);

    /// @notice Emitted after super operator is updated
    /// @param old address of super operator
    /// @param operator new address of super operator
    event SuperOperatorUpdated(address indexed old, address indexed operator);

    /// ============ Constructor ============

    /// @notice Creates a new MultiFaucet contract
    /// @param _DAI address of DAI contract
    /// @param _WETH address of wETH contract
    constructor(address _DAI, address _WETH) 
        ERC721("MultiFaucet NFT", "MFNFT") 
    {
        DAI = IERC20(_DAI);
        WETH = IERC20(_WETH);
        superOperator = msg.sender;
    }

    /// ============ Functions ============

    /// @notice Drips and mints tokens to recipient
    /// @param _recipient to drip tokens to
    function drip(address _recipient) external isApprovedOperator {
        // Drip Ether
        (bool sent,) = _recipient.call{value: ETH_AMOUNT}("");
        require(sent, "Failed dripping ETH");

        // Drip DAI
        require(DAI.transfer(_recipient, DAI_AMOUNT), "Failed dripping DAI");

        // Drip wETH
        require(WETH.transfer(_recipient, WETH_AMOUNT), "Failed dripping wETH");

        // Mint NFTs
        for (uint256 i = 1; i <= NFT_COUNT; i++) {
            _mint(_recipient, nftsMinted + i);
        }
        nftsMinted += NFT_COUNT;

        emit FaucetDripped(_recipient);
    }

    /// @notice Returns number of available drips by token
    /// @return ethDrips — available Ether drips
    /// @return daiDrips — available DAI drips
    /// @return wethDrips — available wETH drips
    function availableDrips() public view 
        returns (uint256 ethDrips, uint256 daiDrips, uint256 wethDrips) 
    {
        ethDrips = address(this).balance / ETH_AMOUNT;
        daiDrips = DAI.balanceOf(address(this)) / DAI_AMOUNT;
        wethDrips = WETH.balanceOf(address(this)) / WETH_AMOUNT;
    }

    /// @notice Allows super operator to drain contract of tokens
    /// @param _recipient to send drained tokens to
    function drain(address _recipient) external isSuperOperator {
        // Drain all Ether
        (bool sent,) = _recipient.call{value: address(this).balance}("");
        require(sent, "Failed draining ETH");

        // Drain all DAI
        uint256 daiBalance = DAI.balanceOf(address(this));
        require(DAI.transfer(_recipient, daiBalance), "Failed draining DAI");

        // Drain all wETH
        uint256 wethBalance = WETH.balanceOf(address(this));
        require(WETH.transfer(_recipient, wethBalance), "Failed dripping wETH");

        emit FaucetDrained(_recipient);
    }

    /// @notice Allows super operator to update approved drip operator status
    /// @param _operator address to update
    /// @param _status of operator to toggle (true == allowed to drip)
    function updateApprovedOperator(address _operator, bool _status) 
        external 
        isSuperOperator 
    {
        approvedOperators[_operator] = _status;
        emit OperatorUpdated(_operator, _status);
    }

    /// @notice Allows super operator to update super operator
    /// @param _operator address to update
    function updateSuperOperator(address _operator) 
        external 
        isSuperOperator 
    {
        address old = superOperator;
        superOperator = _operator;
        emit SuperOperatorUpdated(old, superOperator);
    }

    /// @notice Allows receiving ETH
    receive() external payable {}
}