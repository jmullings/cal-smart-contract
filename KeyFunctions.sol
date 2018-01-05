pragma solidity ^0.4.0;


contract KeyFunctions {
    function KeyFunctions(){

    }
//SET Add AVR
    address public minter;
//GET ADD VAR
    function Getminter() returns (address) { return minter; }


//GETT BALANCE
    mapping (address => uint) public balances;

}
