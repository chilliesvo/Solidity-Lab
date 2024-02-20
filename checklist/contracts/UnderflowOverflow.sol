// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

/**
 * @title tấn công overflow khả thi với solidity ver < 0.8.0
 * if a UINT has a current value of max and new value is added later, it will be set to 0
 */
contract Overflow {
    mapping(address => uint256) public userBalances;

    function depositMax() public {
        require(userBalances[msg.sender] == 0, "balance must be 0");
        uint256 MAX_INT = 2 ** 256 - 1;
        userBalances[msg.sender] += MAX_INT;
    }

    //INSECURE
    function transfer(address _to, uint256 _amount) public {
        require(_amount <= userBalances[msg.sender], "not enough eth");
        userBalances[msg.sender] -= _amount;
        userBalances[_to] += _amount;
    }

    //SECURE
    function transferV2(address _to, uint256 _amount) external {
        require(_amount <= userBalances[msg.sender], "not enough eth");
        /* Check if sender has balance and for overflows */
        require(userBalances[_to] + _amount > userBalances[_to], "invalid transfer");

        userBalances[msg.sender] -= _amount;
        userBalances[_to] += _amount;
    }
}

/**
 * @title tấn công underflow khả thi với solidity ver < 0.8.0
 * similar like OVERFLOW if a UINT decreased in value to less than 0 then it will roll back to max value of the data type
 */
contract Underflow {
    mapping(address => uint256) public userBalances;

    //INSECURE
    function decreaseBalance() public {
        require(userBalances[msg.sender] == 0, "invalid call");
        --userBalances[msg.sender];
    }

    function withdraw(uint256 _amount) external {
        require(userBalances[msg.sender] >= _amount, "not enough eth to withdraw");
        userBalances[msg.sender] -= _amount;
    }

    //SECURE
    function transferV2(address _to, uint256 _amount) external {
        require(_amount <= userBalances[msg.sender], "not enough eth");
        /* Check if sender has balance and for overflows */
        require(userBalances[_to] + _amount > userBalances[_to], "invalid transfer");

        userBalances[msg.sender] -= _amount;
        userBalances[_to] += _amount;
    }
}
