const CourseRegistry = artifacts.require("./CourseRegistry");
const Course = artifacts.require("./Course");

const utils = require("./utils");
const expect = utils.expect;
const expectThrow = utils.expectThrow;

const EthCrypto = require("eth-crypto");

contract("CourseRegistry", function([deployer, author, student]) {
   const link = "yandex.ru";

   before(async function() {
      this.registry = await CourseRegistry.deployed();

      await this.registry.createCourse(author, "Blockchain Introduction", { from: deployer });

      this.course = Course.at(await this.registry.findCourseByID(0));
   });

   it("should be initialized correctly", async function() {
      expect(await this.course.name()).to.be.equal("Blockchain Introduction");
      expect(await this.course.symbol()).to.be.equal("COURSE");
      expect(await this.course.author()).to.be.equal(author);
   });

   it("should fail to create ticket from non-author", async function() {
      await expectThrow(this.course.createStudentTicket(student, link, { from: deployer }));
   });

   it("should create ticket with encrypted link", async function() {
      await this.course.createStudentTicket(student, link, { from: author });

      expect(await this.course.tokenURI(1)).to.be.equal(link);
   });
});