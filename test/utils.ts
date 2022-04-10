import { ethers } from "hardhat";
import { addDays } from "date-fns";

export async function deployContract(name: string, symbol: string) {
  const erc721Starter = await ethers.getContractFactory("ERC721Starter");
  const now = new Date();
  const erc721StaterContract = await erc721Starter.deploy(
    name,
    symbol,
    "ipfs://myhash",
    Math.floor(now.getTime() / 1000),
    Math.floor(addDays(now, 7).getTime() / 1000)
  );
  await erc721StaterContract.deployed();
  return erc721StaterContract;
}
