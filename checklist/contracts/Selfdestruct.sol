// SPDX-License-Identifier: MIT
import "hardhat/console.sol";

pragma solidity 0.8.18;

contract Selfdestruct {
    address payable public receiver;

    constructor(address payable _receiver) payable {
        receiver = _receiver;
    }

    function setReceiver(address payable _addr) external {
        receiver = _addr;
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function destroy() external {
        selfdestruct(receiver);
    }

    receive() external payable {}
}

contract VictimReceive {
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function withdraw() external {
        require(address(this).balance > 0, "not enough eth to withdraw");
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "withdraw fail");
    }
}
