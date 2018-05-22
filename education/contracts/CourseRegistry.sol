pragma solidity ^0.4.23;


import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "./ERC998PossessERC721.sol";

contract CourseRegistry is ERC721Token, ERC998PossessERC721 {
    constructor(string _name, string _symbol) public ERC721Token(_name, _symbol) {}

    mapping (uint256 => address) courses;

    function mint721(address _to)
        public returns(uint256)
    {
        _mint(_to, allTokens.length + 1);
        return allTokens.length;
    }

    function _owns(address _owner, uint256 _tokenId)
        internal view returns(bool)
    {
        return (tokenOwner[_tokenId] == _owner);
    }

    function safeTransferNFTP(
        address _to, uint256 _tokenId, address _nftpContract, uint256 _nftpTokenId, bytes _data
    ) public {

        require(_owns(msg.sender, _tokenId));

        transferNFTP(_to, _tokenId, _nftpContract, _nftpTokenId);

        nftpReceived(_nftpContract, _nftpTokenId, _data);
    }
}