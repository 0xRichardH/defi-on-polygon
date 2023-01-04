import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract } from "ethers"
import { ethers } from "hardhat"

describe("GoFlow", function() {
  let goflow: Contract, owner: SignerWithAddress, otherAccount: SignerWithAddress

  const deployContract = async () => {
    const [_owner, _otherAccount] = await ethers.getSigners()
    const Goflow = await ethers.getContractFactory("Goflow")
    goflow = await Goflow.deploy()
    owner = _owner
    otherAccount = _otherAccount
  }

  const mint = async (user: SignerWithAddress, amount: number) => {
    const tx = await goflow.connect(user).mint(amount)
    await tx.wait()
  }

  beforeEach(async () => {
    await deployContract()
  })

  describe("Deployment", () => {
    it("Should deploy and return correct symbol", async () => {
      expect(await goflow.symbol()).to.equal("GOFLOW")
    })
  })

  describe("Minting", () => {
    it("Should mint tokens to user", async () => {
      await mint(owner, 100)
      expect(await goflow.balanceOf(owner.address)).to.equal(100)
    })
  })

  describe("Burning", () => {
    it("Should burn tokens from the user", async () => {
      await mint(owner, 100)
      expect(await goflow.balanceOf(owner.address)).to.equal(100)
      expect(await goflow.balanceOf(otherAccount.address)).to.equal(0)

      const tx = await goflow.connect(owner).burn(20)
      await tx.wait()
      expect(await goflow.balanceOf(owner.address)).to.equal(80)
      expect(await goflow.balanceOf(otherAccount.address)).to.equal(0)
    })
  })

  describe("Transfer", () => {
    it("Should transfer tokens to otherAccount", async () => {
      await mint(owner, 100)
      await mint(otherAccount, 100)

      await goflow.connect(owner).transfer(otherAccount.address, 20)
      expect(await goflow.balanceOf(owner.address)).to.equal(80)
      expect(await goflow.balanceOf(otherAccount.address)).to.equal(120)
    })
  })

  describe("TransferFrom", () => {
    it("Should approve a spender to be able to transfer owner's tokens", async () => {
      await mint(owner, 20)

      const approve = await goflow.approve(otherAccount.address, 20)
      await approve.wait()
      const transferFrom = await goflow.connect(otherAccount).transferFrom(owner.address, otherAccount.address, 20)
      await transferFrom.wait()
      expect(await goflow.balanceOf(owner.address)).to.equal(0)
      expect(await goflow.balanceOf(otherAccount.address)).to.equal(20)
    })

    it("Should not allow spender to transfer more tokens than they have", async () => {
      await mint(owner, 20)
      expect(await goflow.balanceOf(owner.address)).to.equal(20)
      expect(await goflow.approve(otherAccount.address, 20)).to.be.revertedWith("Insufficient balance for approval")
    })
  })
})
