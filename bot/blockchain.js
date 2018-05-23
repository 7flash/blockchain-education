const fs = require("fs");
const path = require("path");

const HDWalletProvider = require("truffle-hdwallet-provider");
const contract = require("truffle-contract");

if(!fs.existsSync(path.resolve(__dirname, "mnemonic"))) {
    throw new Error("Mnemonic not found");
}

const mnemonic = fs.readFileSync(path.resolve(__dirname, "mnemonic")).toString().trim();
const deployer = "0xeea8b1619f4063f816051ae056758686ec58b7fd";
const registryAddress = "0x18f6f3b24303d043921c5b7325a560614feed50b";

const network = {
    provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/")
};

const CourseArtifact = require("./Course.json");
const CourseRegistryArtifact = require("./CourseRegistry.json");

const Course = contract(CourseArtifact);
const CourseRegistry = contract(CourseRegistryArtifact);

Course.setProvider(network.provider);
CourseRegistry.setProvider(network.provider);

module.exports = {
    async publish(author, name, vrs)
    {
        const registry = await CourseRegistry.at(registryAddress);

        console.log(`Registry: ${registry.address}`);

        const course = await registry.createCourseProxy(author, name, vrs.v, vrs.r, vrs.s, { from: deployer });

        return course;
    },

    async share(courseID, studentAddress, link, vrs) {
        const registry = await CourseRegistry.at(registryAddress);

        const course = await registry.findCourseByID.call(courseID);

        console.log(course);

        const courseInstance = await Course.at(course);

        console.log(studentAddress);
        console.log(link);
        console.log(vrs);

        const tokenID = await courseInstance.createStudentTokenProxy(studentAddress, link, vrs.v, vrs.r, vrs.s, { from: deployer });

        console.log(tokenID);

        return tokenID;
    },

    async access(courseID, tokenID) {
        const registry = await CourseRegistry.at(registryAddress);

        const courseAddress = await registry.findCourseByID.call(courseID);

        const course = await Course.at(courseAddress);

        const link = await course.tokenURI.call(tokenID);

        console.log(link);

        return link;
    }
};