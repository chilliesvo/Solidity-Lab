// SPDX-License-Identifier: MIT
import "hardhat/console.sol";

pragma solidity 0.8.18;

contract CallerV2 {
    uint public number;
    address public called;

    constructor(address _called) {
        called = _called;
    }

    function callSetNumber(uint _number) public returns (bool) {
        (bool success, ) = called.delegatecall(abi.encodeWithSignature("setNumber(uint256)", _number));
        console.log(success);
        return success;
    }
}

contract CalledV2 {
    uint public number;

    function setNumber(uint _number) public {
        number = _number;
    }
}
