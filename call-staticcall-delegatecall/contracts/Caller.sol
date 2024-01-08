// SPDX-License-Identifier: MIT
import "hardhat/console.sol";

pragma solidity 0.8.18;

contract Caller {
    event CallCalled(bool success, bytes data);
    event SentEther(bool success, bytes data);

    function callCalled(address _called) public returns (bool success, bytes memory data) {
        (success, data) = _called.call(abi.encodeWithSignature("increment()"));
        emit CallCalled(success, data);
    }

    function callCalledWithPayload(
        address _called,
        bytes memory _payload
    ) public returns (bool success, bytes memory data) {
        (success, data) = _called.call(_payload);
        emit CallCalled(success, data);
    }

    function sendEther(address _to, uint256 _value) public returns (bool success, bytes memory data) {
        (success, data) = _to.call{value: _value}("");
        emit SentEther(success, data);
    }

    function sendEtherWithPayload(
        address _to,
        uint256 _value,
        bytes memory _payload
    ) public returns (bool success, bytes memory data) {
        (success, data) = _to.call{value: _value}(_payload);
        emit SentEther(success, data);
    }

    function sendEtherWithGas(
        address _to,
        uint256 _value,
        uint256 _gas
    ) public returns (bool success, bytes memory data) {
        (success, data) = _to.call{value: _value, gas: _gas}("");
        emit SentEther(success, data);
    }

    receive() external payable {
        // console.log("caller log", msg.value);
    }
}
