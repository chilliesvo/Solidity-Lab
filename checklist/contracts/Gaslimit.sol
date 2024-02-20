// SPDX-License-Identifier: MIT
import "hardhat/console.sol";

pragma solidity 0.8.18;

struct Payee {
    address addr;
    uint256 value;
}

contract GaslimitVictim {
    Payee[] public payees;
    uint256 public nextPayeeIndex;

    error PayFail(uint256 fromIndex, address addr);

    function addPayee(address _users) external payable {
        payees.push(Payee({addr: _users, value: msg.value}));
    }

    function getPayeeLength() external view returns (uint256) {
        return payees.length;
    }

    // transaction is fail if the length of Payees too large, causing a shortage of gas
    function payOutInsecure() external {
        for (uint256 i = 0; i < payees.length; ++i) {
            Payee memory payee = payees[i];
            (bool succes, ) = payee.addr.call{value: payee.value}("");
            if (!succes) revert PayFail(i, payee.addr);
        }
    }

    // calculate the gas before proceeding to the next loop
    function payOut() external {
        uint256 i = nextPayeeIndex;
        while (i < payees.length && gasleft() > 200000) {
            Payee memory payee = payees[i];
            (bool succes, ) = payee.addr.call{value: payee.value}("");
            if (!succes) revert PayFail(i, payee.addr);
            ++i;
        }
        nextPayeeIndex = i;
    }
}
