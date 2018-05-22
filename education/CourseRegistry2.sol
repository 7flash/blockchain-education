pragma solidity ^0.4.23;

import "./Course.sol";

contract CourseRegistry {
    address[] courses;

    function createCourse(address _author, string _name)
        public
    {
        address createdCourse = new Course(_author, _name);

        courses.push(createdCourse);
    }

    function findCourseByID(uint256 _id)
        public constant returns (address)
    {
        return courses[_id];
    }
}