// contracts/WrappedAssetToken.sol
// SPDX-License-Identifier: MIT

pragma solidity >0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract WrappedAssetToken is ERC20PresetMinterPauser {
    uint8 private _decimals; // Typically 18 decimals, but some use a different amount (ie Bitcoin has 8)

    // The ChainBridgeService will be listening for this event and trigger a transfer
    // from the Custodial Wallet to the User wallet of the original External Asset
    event UnwrapRequested(address tokenHolder, uint256 amount);

    // Included decimals here to allow for differences between External Asset implementations
    constructor(string memory name, string memory symbol, uint8 decimalsOverride) ERC20PresetMinterPauser(name, symbol) {
        _decimals = decimalsOverride;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    // This is the function that the user will call to request that their Wrapped Asset Token
    // be redeemed for the original External Asset.
    // The ChainBridgeService will be the one to send the funds to the Uuser
    // from the Custodial Wallet of the External Asset
    function requestUnwrap(uint _amount) public {
        require(_amount <= ERC20.balanceOf(msg.sender), "WrappedToken: requested unwrap amount exceeds balance");
        ERC20Burnable.burn(_amount);
        emit UnwrapRequested(msg.sender, _amount);
    }
}
