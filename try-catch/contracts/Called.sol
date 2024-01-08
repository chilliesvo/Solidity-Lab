// SPDX-License-Identifier: MIT
import "hardhat/console.sol";

pragma solidity 0.8.18;

contract Called {
    uint256 public number;

    function increment() public returns (uint256) {
        return ++number;
    }

    function plus(uint256 _value) public view returns (uint256) {
        return number + _value;
    }

    function div(uint256 _value) public view returns (uint256) {
        return _value / number;
    }

    receive() external payable {
        console.log("called log", msg.value);
    }
}
