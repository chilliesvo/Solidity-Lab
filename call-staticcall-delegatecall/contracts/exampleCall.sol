// SPDX-License-Identifier: MIT
import "hardhat/console.sol";

pragma solidity 0.8.18;

contract Caller {
    address immutable called;
    uint256 public number;

    event Response(bool success, bytes data);

    constructor(address _called) {
        called = _called;
    }

    function callCalled() public returns (bool success, bytes memory data) {
        (success, data) = called.call(abi.encodeWithSignature("increment()"));
        emit Response(success, data);
    }

    function callCalledWithPayload(bytes memory _payload) public returns (bool success, bytes memory data) {
        (success, data) = called.call(_payload);
        emit Response(success, data);
    }

    function sendEther(address _to, uint256 _value) public returns (bool success, bytes memory data) {
        (success, data) = _to.call{value: _value}("");
        emit Response(success, data);
    }

    function sendEtherWithPayload(address _to, bytes memory _payload) public payable {
        (bool success, bytes memory data) = _to.call{value: msg.value, gas: 50000}(_payload);
        require(success, "call external fail");
        emit Response(success, data);
    }

    // Calling a function that does not exist triggers the fallback function.
    function testCallDoesNotExist(address payable _addr) public payable {
        (bool success, bytes memory data) = _addr.call{value: msg.value}(abi.encodeWithSignature("doesNotExist()"));

        emit Response(success, data);
    }

    function sendEtherWithGas(
        address _to,
        uint256 _gas,
        bytes memory _payload
    ) public payable returns (bool success, bytes memory data) {
        (success, data) = _to.call{value: msg.value, gas: _gas}(_payload);
        emit Response(success, data);
    }

    receive() external payable {
        console.log("sent log", msg.value);
    }
}

contract Called {
    uint256 public number;

    function increment() public returns (uint256) {
        return ++number;
    }

    function setNumber(uint256 _number) public payable returns (uint256) {
        number = _number;
        return number;
    }

    function getNumber() public payable returns (uint256) {
        return number;
    }

    receive() external payable {
        console.log("called log", msg.value);
    }
}
