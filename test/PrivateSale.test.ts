import chaiAsPromised from "chai-as-promised";
import chai from "chai";
import { ethers } from "hardhat";
import { deployContract } from "./utils";
import { ERC721Starter } from "../typechain";
import { BigNumber } from "ethers";

chai.use(chaiAsPromised);
const { expect } = chai;

describe("Private Sale", () => {
  let contract: ERC721Starter;

  beforeEach(async () => {
    contract = await deployContract("Happy Ape Bicycle Club", "HABC");
  });

  it("should whitelist address with correct qty", async () => {
    const [, alice] = await ethers.getSigners();
    await contract.addAddressToWhitelist(alice.address, 2);

    const result = await contract.addressToMintQty(alice.address);
    expect(result.toNumber()).to.be.equal(2);
  });

  it("should replace the old qty with the latest one", async () => {
    const [, alice] = await ethers.getSigners();
    await contract.addAddressToWhitelist(alice.address, 2);
    await contract.addAddressToWhitelist(alice.address, 3);

    const result = await contract.addressToMintQty(alice.address);
    const arrayLength = await contract.whitelistedAddressesCount();
    expect(result.toNumber()).to.be.equal(3);
    expect(arrayLength.toNumber()).to.be.equal(1);
  });

  it("should clear whitelisted addresses quantity", async () => {
    const [, alice] = await ethers.getSigners();
    await contract.addAddressToWhitelist(alice.address, 2);
    await contract.clearWhitelist();

    const result = await contract.addressToMintQty(alice.address);
    expect(result.toNumber()).to.be.equal(0);
  });

  it("should bulk whitelist correctly", async () => {
    const [, alice, bob] = await ethers.getSigners();
    await contract.addAddressesToWhitelist(
      [alice.address, bob.address],
      [2, 3]
    );

    const aliceResult = await contract.addressToMintQty(alice.address);
    const bobResult = await contract.addressToMintQty(bob.address);
    const arrayLength = await contract.whitelistedAddressesCount();

    expect(aliceResult).to.be.equal(2);
    expect(bobResult).to.be.equal(3);
    expect(arrayLength).to.be.equal(2);
  });

  it("should be cheaper to execute whitelisting in bulk", async () => {
    const [, alice, bob, charlie, dan, edgar, franky, gabriel, hugo] =
      await ethers.getSigners();
    const signers = [alice, bob, charlie, dan];
    const bulkSigners = [edgar, franky, gabriel, hugo];

    let gasFeeUsedForIndividualWhitelisting = BigNumber.from(0);

    for (let i = 0; i < signers.length; i++) {
      const tx = await contract.addAddressToWhitelist(signers[i].address, 2);
      const receipt = await tx.wait();
      const gasFee = receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice);
      gasFeeUsedForIndividualWhitelisting =
        gasFeeUsedForIndividualWhitelisting.add(gasFee);
    }

    const tx = await contract.addAddressesToWhitelist(
      bulkSigners.map((b) => b.address),
      [3, 3, 3, 3]
    );
    const receipt = await tx.wait();
    const gasFeeForBulkWhitelisting = receipt.cumulativeGasUsed.mul(
      receipt.effectiveGasPrice
    );

    expect(gasFeeForBulkWhitelisting.toNumber()).lessThan(
      gasFeeUsedForIndividualWhitelisting.toNumber()
    );
  });

  // Uncomment if we want to compare gas price.
  // it("should be cheaper to individually whitelist addresses", async () => {
  //   const [, alice, bob, charlie, dan, edgar, franky, gabriel, hugo] = await ethers.getSigners();
  //   const signers = [alice, bob, charlie, dan];
  //   const bulkSigners = [edgar, franky, gabriel, hugo];

  //   let gasFeeUsedForIndividualWhitelisting = BigNumber.from(0);

  //   for (let i = 0; i < signers.length; i++) {
  //     const tx = await contract.addAddressToWhitelist(signers[i].address, 2);
  //     const receipt = await tx.wait();
  //     const gasFee = receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice);
  //     gasFeeUsedForIndividualWhitelisting = gasFeeUsedForIndividualWhitelisting.add(gasFee);
  //   }

  //   const tx = await contract.addAddressesToWhitelist(bulkSigners.map(b => b.address), [3, 3, 3, 3]);
  //   const receipt = await tx.wait();
  //   const gasFeeForBulkWhitelisting = receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice);

  //   expect(gasFeeForBulkWhitelisting.toNumber()).greaterThan(gasFeeUsedForIndividualWhitelisting.toNumber());
  // });

  // Uncomment if we want to compare gas price.
  // it("should be the same to whitelist individually or in bulk", async () => {
  //   const [, alice, bob, charlie, dan, edgar, franky, gabriel, hugo] = await ethers.getSigners();
  //   const signers = [alice, bob, charlie, dan];
  //   const bulkSigners = [edgar, franky, gabriel, hugo];

  //   let gasFeeUsedForIndividualWhitelisting = BigNumber.from(0);

  //   for (let i = 0; i < signers.length; i++) {
  //     const tx = await contract.addAddressToWhitelist(signers[i].address, 2);
  //     const receipt = await tx.wait();
  //     const gasFee = receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice);
  //     gasFeeUsedForIndividualWhitelisting = gasFeeUsedForIndividualWhitelisting.add(gasFee);
  //   }

  //   const tx = await contract.addAddressesToWhitelist(bulkSigners.map(b => b.address), [3, 3, 3, 3]);
  //   const receipt = await tx.wait();
  //   const gasFeeForBulkWhitelisting = receipt.cumulativeGasUsed.mul(receipt.effectiveGasPrice);

  //   expect(gasFeeForBulkWhitelisting.toNumber()).to.be.equal(gasFeeUsedForIndividualWhitelisting.toNumber());
  // });
});
