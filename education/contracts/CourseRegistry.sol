pragma solidity ^0.4.23;

import "./Course.sol";

contract CourseRegistry {
    address[] courses;

    function createCourse(address _author, string _name)
        public
    {
        require(msg.sender == _author);

        createCourseInternal(_author, _name);
    }

    function createCourseProxy(address _author, string _name, uint8 v, bytes32 r, bytes32 s)
        public
    {
        require(isSignatureValid(_name, _author, v, r, s));

        createCourseInternal(_author, _name);
    }

    function createCourseInternal(address _author, string _name)
        internal
    {
        address createdCourse = new Course(_author, _name);

        courses.push(createdCourse);
    }

    function prefixedHash(string name, address author)
        public constant returns(bytes32)
    {
        bytes32 hash = keccak256(
            name,
            author
        );

        return hash;
    }

    function isSignatureValid(string name, address author, uint8 v, bytes32 r, bytes32 s)
        public constant returns(bool correct)
    {
        bytes32 mustBeSigned = prefixedHash(name, author);
        address signer = ecrecover(
            mustBeSigned,
            v, r, s
        );

        return (signer == author);
    }

    function findCourseByID(uint256 _id)
        public constant returns (address)
    {
        return courses[_id];
    }
}