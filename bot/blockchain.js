const fs = require("fs");
const path = require("path");

const HDWalletProvider = require("truffle-hdwallet-provider");
const contract = require("truffle-contract");

if(!fs.existsSync(path.resolve(__dirname, "mnemonic"))) {
    throw new Error("Mnemonic not found");
}

const mnemonic = fs.readFileSync(path.resolve(__dirname, "mnemonic")).toString().replace(/^[\r\n]+/, '').replace(/[\r\n]+$/, '');
const deployer = "0x123";

const network = {
    provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/")
};

const CourseArtifact = require("./Course.json");
const CourseRegistryArtifact = require("./CourseRegistry.json");

const Course = contract(CourseArtifact);
const CourseRegistry = contract(CourseRegistryArtifact);

Course.setProvider(network);

module.exports = {
    async publish(author, name, vrs) {
        const course = await CourseRegistry.createCourseProxy(author, name, vrs.v, vrs.r, vrs.s, { from: deployer });

        const courseAddress = course.address;

        return courseAddress;
    },

    async share(courseID, studentAddress, link, vrs) {
        const course = await CourseRegistry.findCourseByID(courseID);

        const tokenID = await course.createStudentTokenProxy(studentAddress, link, vrs.v, vrs.r, vrs.s, { from: deployer });

        return tokenID;
    },

    async access(courseID, tokenID) {
        const courseAddress = await CourseRegistry.findCourseByID(courseID);

        const course = await Course.at(courseAddress);

        const link = await course.tokenURI(tokenID);

        return link;
    }
};