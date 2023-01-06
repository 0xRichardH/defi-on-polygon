import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { makeBig } from "../../Front-end/lib/number-utils";

describe("Forum", () => {
  let forum: Contract, goflow: Contract;
  let owner: SignerWithAddress,
    user1: SignerWithAddress,
    user2: SignerWithAddress;

  const deployContracts = async () => {
    const Goflow = await ethers.getContractFactory("Goflow");
    goflow = await Goflow.deploy();
    await goflow.deployed();

    const Forum = await ethers.getContractFactory("Forum");
    forum = await Forum.deploy(goflow.address);
    await forum.deployed();

    const [_owner, _user1, _user2] = await ethers.getSigners();
    owner = _owner;
    user1 = _user1;
    user2 = _user2;
  };

  const postQuestionsAndAnswers = async (
    user1: SignerWithAddress,
    user2: SignerWithAddress
  ) => {
    const tx = await forum
      .connect(user1)
      .postQuestion("What is the meaning of life?");
    await tx.wait();
    const tx2 = await forum.connect(user2).postQuestion("huh?");
    await tx2.wait();

    const tx3 = await forum.connect(user1).postAnswer(0, "don't know");
    await tx3.wait();
    const tx4 = await forum.connect(user2).postAnswer(1, "42");
    await tx4.wait();
  };

  const mint = async (user: SignerWithAddress, amount: number) => {
    const tx = await goflow.connect(user).mint(makeBig(amount));
    await tx.wait();
  };

  beforeEach(async () => {
    await deployContracts();
  });

  describe("Deployment", () => {
    it("Should deploy the forum contract", async () => {
      console.log("forum address:", forum.address);
      console.log("goflow address:", await forum.Goflow());
      expect(await forum.Goflow()).to.equal(goflow.address);
    });
  });

  describe("Posting questions and answers", () => {
    it("Should post questions", async () => {
      const tx = await forum
        .connect(user1)
        .postQuestion("What is the meaning of life?");
      await tx.wait();
      const tx2 = await forum.connect(user2).postQuestion("huh?");
      await tx2.wait();

      expect((await forum.questions(0)).message).to.equal(
        "What is the meaning of life?"
      );
      expect((await forum.questions(1)).message).to.equal("huh?");
    });

    it("should post a question and answer it", async () => {
      await postQuestionsAndAnswers(user1, user2);

      expect((await forum.answers(0)).message).to.equal("don't know");
      expect((await forum.answers(1)).message).to.equal("42");
      expect((await forum.answers(0)).questionId).to.equal(0);
      expect((await forum.answers(1)).questionId).to.equal(1);
      expect((await forum.answers(0)).creatorAddress).to.equal(user1.address);
      expect((await forum.answers(1)).creatorAddress).to.equal(user2.address);
    });
  });

  describe("Upvoting answers", () => {
    it("should upvote the answer and pay the answer credit", async () => {
      mint(owner, 10);
      mint(user1, 10);
      mint(user2, 10);

      const ownerApprove = await goflow
        .connect(owner)
        .approve(forum.address, makeBig(10));
      await ownerApprove.wait();
      const user2Approve = await goflow
        .connect(user2)
        .approve(forum.address, makeBig(10));
      await user2Approve.wait();

      await postQuestionsAndAnswers(user1, user2);

      const upvoteTx = await forum.connect(owner).upvoteAnswer(0);
      await upvoteTx.wait();
      const upvoteTx2 = await forum.connect(user2).upvoteAnswer(0);
      await upvoteTx2.wait();

      expect(await forum.getUpvotes(0)).to.equal(2);
      expect(await forum.getUpvotes(1)).to.equal(0);
      expect(await goflow.balanceOf(user1.address)).to.equal(makeBig(12));
    });

    it("should upvote an answer but pay the forum contract", async () => {
      mint(owner, 8);
      mint(user1, 10);

      const user1Approve = await goflow
        .connect(user1)
        .approve(forum.address, makeBig(10));
      await user1Approve.wait();

      await postQuestionsAndAnswers(owner, user1);

      const upvoteTx = await forum.connect(user1).upvoteAnswer(0);
      await upvoteTx.wait();

      expect(await forum.getUpvotes(0)).to.equal(1);
      expect(await goflow.balanceOf(owner.address)).to.equal(makeBig(8));
      expect(await goflow.balanceOf(user1.address)).to.equal(makeBig(9));
      expect(await goflow.balanceOf(forum.address)).to.equal(makeBig(1));
    });

    it("should not be possible to upvote an answer twice", async () => {
      mint(owner, 10);
      mint(user1, 10);

      const user1Approve = await goflow
        .connect(user1)
        .approve(forum.address, makeBig(10));
      await user1Approve.wait();

      await postQuestionsAndAnswers(owner, user1);

      const upvoteTx = await forum.connect(user1).upvoteAnswer(0);
      await upvoteTx.wait();

      await expect(forum.connect(user1).upvoteAnswer(0)).to.be.revertedWith(
        "You already upvoted this answer"
      );
      expect(await forum.getUpvotes(0)).to.equal(1);
      expect(await goflow.balanceOf(owner.address)).to.equal(makeBig(11));
      expect(await goflow.balanceOf(user1.address)).to.equal(makeBig(9));
    });
  });
});
