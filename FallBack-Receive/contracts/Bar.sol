// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "hardhat/console.sol";

contract Bar {
    uint256 private _countNumber;

    event Track(string indexed _function, address sender, uint value, bytes data);

    constructor(uint256 _count) {
        _countNumber = _count;
    }

    function setCount(uint256 _number) external payable {
        _countNumber = _number;
    }

    function getCount() external view returns (uint256) {
        return _countNumber;
    }

    //Fallback function either has to have the signature "fallback()" or "fallback(bytes calldata) returns (bytes memory)".solidity(5570)
    //Only one fallback function is allowed.solidity(7301)
    fallback() external payable {
        console.log("login fallback");
        emit Track("fallback()", msg.sender, msg.value, msg.data);
    }

    //This contract has a payable fallback function, but no receive ether function. Consider adding a receive ether function
    //Receive ether function cannot take parameters.solidity(6857)
    //Only one receive function is allowed.solidity(4046)
    // receive() external payable {
    //     console.log(msg.value);
    //     console.log("login receive");
    //     this.setCount(msg.value);
    // }
}
