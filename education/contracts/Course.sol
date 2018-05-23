pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract Course is ERC721Token {
    address public author;

    constructor(address _author, string _name)
        public ERC721Token(_name, "COURSE")
    {
        author = _author;
    }

    function createStudentToken(address _student, string _link)
        public onlyAuthor returns(uint256)
    {
        return createStudentTokenInternal(_student, _link);
    }

    function createStudentTokenInternal(address _student, string _link)
        internal returns(uint256)
    {
        require(balanceOf(_student) == 0);

        uint256 tokenID = allTokens.length + 1;

        _mint(_student, tokenID);
        _setTokenURI(tokenID, _link);

        return allTokens.length;
    }

    function createStudentTokenProxy(address _student, string _link, uint8 v, bytes32 r, bytes32 s)
        public returns(uint256)
    {
        require(isSignatureValid(_student, _link, v, r, s));

        createStudentTokenInternal(_student, _link);
    }

    function prefixedHash(address student, string link)
        public constant returns(bytes32)
    {
        bytes32 hash = keccak256(
            student,
            link
        );

        return hash;
    }

    function isSignatureValid(address student, string link, uint8 v, bytes32 r, bytes32 s)
        public constant returns(bool correct)
    {
        bytes32 mustBeSigned = prefixedHash(student, link);
        address signer = ecrecover(
            mustBeSigned,
            v, r, s
        );

        return (signer == author);
    }

    modifier onlyAuthor() {
        require(msg.sender == author);
        _;
    }
}