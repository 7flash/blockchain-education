pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract Course is ERC721Token {
    address public author;

    constructor(address _author, string _name)
        public ERC721Token(_name, "COURSE")
    {
        author = _author;
    }

    function createStudentTicket(address _student, string _encryptedLink)
        public onlyAuthor returns(uint256)
    {
        uint256 tokenID = allTokens.length + 1;

        _mint(_student, tokenID);
        _setTokenURI(tokenID, _encryptedLink);

        return allTokens.length;
    }

    modifier onlyAuthor() {
        require(msg.sender == author);
        _;
    }
}