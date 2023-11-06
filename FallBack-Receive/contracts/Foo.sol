// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "hardhat/console.sol";
import "./Bar.sol";

contract Foo {
    address payable bar;

    constructor(address payable _bar) {
        bar = _bar;
    }

    function getBarCounter() external view returns (uint256) {
        return Bar(bar).getCount();
    }

    //Explicit type conversion not allowed from non-payable "address" to "contract Bar", which has a payable fallback function
    function setBarCounter(uint256 _number) external {
        Bar(bar).setCount(_number);
    }
}
