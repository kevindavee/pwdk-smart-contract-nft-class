import { ethers } from "hardhat";

export async function deployContract(name: string, symbol: string) {
  const erc721Starter = await ethers.getContractFactory("ERC721Starter");
  const erc721StaterContract = await erc721Starter.deploy(
    name,
    symbol,
    "ipfs://myhash"
  );
  await erc721StaterContract.deployed();
  return erc721StaterContract;
}
