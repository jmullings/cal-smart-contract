pragma solidity ^0.4.11;

contract SmartContractTest {

    address owner;
    address apply;
    uint public value;
    uint public numSH;

    // struct ShareHolders {
    //     uint8 Count;
    // }

    ShareHolders[] public shareholders;
    function SmartContractTest(uint _numSHolders) public{
        owner = msg.sender;
        numSH=_numSHolders;
        // uint[] memory a = new uint[](_numSHolders);
    }

    struct ShareHolders {
    uint weight; // weight is accumulated by delegation
    bool claimed;  // if true, that person already claimed account
    address delegate; // person delegated to
    bytes32 firstName; //Share holders name
    bytes32 lastName; //Share holders name
    bytes32 email; //Share holders email
    uint shares; // number of accumulated Shares
    }

    //mapping(address => SH_Struct) public sholder;
    function addPerson(bytes32 _firstName, bytes32 _lastName, bytes32 _email, uint _shares) payable public returns (bool success) {
        ShareHolders memory newPerson;
        newPerson.firstName = _firstName;
        newPerson.lastName = _lastName;
        newPerson.email = _email;
        newPerson.shares = _shares;
        shareholders.push(newPerson);
        return true;
    }

    function getPeople() public constant returns (bytes32[], bytes32[], bytes32[], uint[]) {

        uint length = shareholders.length;

        bytes32[] memory firstNames = new bytes32[](length);
        bytes32[] memory lastNames = new bytes32[](length);
        bytes32[] memory email = new bytes32[](length);
        uint[] memory shares = new uint[](length);

        for (uint i = 0; i < length; i++) {
            ShareHolders memory currentPerson;
            currentPerson = shareholders[i];
            firstNames[i] = currentPerson.firstName;
            lastNames[i] = currentPerson.lastName;
            email[i] = currentPerson.email;
            shares[i] = currentPerson.shares;
        }
        return (firstNames, lastNames, email,shares);
    }

    function set(uint x) public {
        numSH = x * 10;
    }

    function get() public view returns (uint) {
        return numSH;
    }
}