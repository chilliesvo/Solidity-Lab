// SPDX-License-Identifier: MIT
import "hardhat/console.sol";
import "./Mock/ERC20Mock.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

pragma solidity 0.8.18;

contract Caller {
    using Strings for uint256;

    Called public called;
    ERC20Mock public token;

    mapping(address => uint256) public transfered;

    event CatchLog(string);
    event SentEther(bool success, bytes data);

    constructor(address _called, address _token) {
        called = Called(_called);
        token = ERC20Mock(_token);
    }

    /**
     * This catch clause is executed if the error was caused by revert("reasonString") or
     * require(false, "reasonString") (or an internal error that causes such an exception).
     */
    function catchRequire() public {
        try called.caseRequire() {
            emit CatchLog("call success!");
        } catch Error(string memory reason) {
            // console.log(reason);
            emit CatchLog(reason);
        }
    }

    /**
     * If the error was caused by a panic,
     * i.e. by a failing assert, division by zero,
     * invalid array access, arithmetic overflow and others, this catch clause will be run.
     */
    function catchDivByZero() public {
        try called.caseDivByZero(0) {
            emit CatchLog("call success!");
        } catch Panic(uint errorCode) {
            // console.log(errorCode);
            emit CatchLog(errorCode.toString());
        }
    }

    /**
     * If the error was caused by a panic,
     * i.e. by a failing assert, division by zero,
     * invalid array access, arithmetic overflow and others, this catch clause will be run.
     */
    function catchOverFlow() public {
        try called.caseOverFlow(10) {
            emit CatchLog("call success!");
        } catch Panic(uint errorCode) {
            // console.log(errorCode);
            emit CatchLog(errorCode.toString());
        }
    }

    /**
     * This clause is executed if the error signature does not match any other clause,
     * if there was an error while decoding the error message,
     * or if no error data was provided with the exception.
     * The declared variable provides access to the low-level error data in that case.
     */
    function catchOther() public {
        try called.caseDivByZero(0) {
            emit CatchLog("call success!");
        } catch (bytes memory) {
            // console.log();
            emit CatchLog("call fail");
        }
    }

    /**
     * If you are not interested in the error data,
     * you can just use catch { ... } (even as the only catch clause) instead of the previous clause.
     *
     * This type of catch block will run regardless of the type of error
     * (Panic(uint256), Error(string) , custom error , etc…).
     */
    function genericCatch() public {
        try called.caseDivByZero(0) {
            emit CatchLog("call success!");
        } catch {
            emit CatchLog("call fail");
        }
    }

    function transferSomeTokens(address _recipient) public {
        /**
         * If currentBalance() returns a value lower than 100 and the expression underflows,
         * the control will not pass to the catch block. Instead the contract will revert.
         */
        try token.transfer(_recipient, currentBalance() - 100) returns (bool) {
            uint256 newBalance = token.balanceOf(_recipient);

            // this is a call to an internal function within this contract
            _registerTransfer(_recipient, newBalance);
        } catch {
            console.log("call fail");
        }
    }

    // ============ Internal functions =============

    function currentBalance() public returns (uint256) {
        return token.balanceOf(address(this));
    }

    function _registerTransfer(address _recipient, uint256 _newBalance) private {
        transfered[_recipient] = _newBalance;
    }
}

contract Called {
    uint256 public number;

    error Failed();

    function caseRequire() public pure {
        require(0 > 1, "zero less than one");
    }

    function caseDivByZero(uint256 _zero) public pure {
        1 / _zero;
    }

    function caseOverFlow(uint256 _number) public {
        uint256 accumulation = _number * 2;
        caseOverFlow(accumulation);
    }
}
