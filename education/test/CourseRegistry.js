const CourseRegistry = artifacts.require("./CourseRegistry");
const Course = artifacts.require("./Course");

const utils = require("./utils");
const expect = utils.expect;
const expectThrow = utils.expectThrow;

const EthCrypto = require("eth-crypto");

contract("CourseRegistry", function([deployer, author, student, anotherStudent]) {
   const link = "yandex.ru";

   let encryptedLink = "";

   before(async function() {
      this.registry = await CourseRegistry.deployed();

      await this.registry.createCourse(author, "Blockchain Introduction", { from: author });

      this.course = Course.at(await this.registry.findCourseByID(0));

      this.author = EthCrypto.createIdentity();
      this.student = EthCrypto.createIdentity();
   });

   it("should be initialized correctly", async function() {
      expect(await this.course.name()).to.be.equal("Blockchain Introduction");
      expect(await this.course.symbol()).to.be.equal("COURSE");
      expect(await this.course.author()).to.be.equal(author);
   });

   it("should encrypt link", async function() {
      const encrypted = await EthCrypto.encryptWithPublicKey(this.student.publicKey, link);

      encryptedLink = EthCrypto.cipher.stringify(encrypted);
   });

   it("should decrypt link", async function() {
      const encryptedObject = EthCrypto.cipher.parse(encryptedLink);

      const decryptedLink = await EthCrypto.decryptWithPrivateKey(this.student.privateKey, encryptedLink);

      expect(decryptedLink).to.be.equal(link);
   });

   it("should fail to create ticket from non-author", async function() {
      await expectThrow(this.course.createStudentToken(student, encryptedLink, { from: deployer }));
   });

   it("should create ticket with encrypted link", async function() {
      await this.course.createStudentToken(student, encryptedLink, { from: author });
   });

   it("should fail to create a ticket for the same student", async function() {
       await expectThrow(this.course.createStudentToken(student, encryptedLink, { from: author }));
   });

   /*
   it("should create ticket for another student through proxy", async function() {
       const signHash = EthCrypto.hash.keccak256([
           {
               type: 'string',
               value: 'course2018'
           },
           {
               type: 'address',
               value: this.course.address
           },
           {
               type: 'address',
               value: student
           }
       ]);

       const signature = EthCrypto.sign(
           authorPrivateKey,
           signHash
       );

       const vrs = EthCrypto.vrs.fromString(signature);

       await this.course.createStudentTokenProxy(vrs.v, vrs.r, vrs.s, anotherStudent, encryptedLink, { from: deployer });
   });
   */
});