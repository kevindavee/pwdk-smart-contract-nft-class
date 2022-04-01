import { ethers } from "hardhat";
import { config } from "dotenv";

config();

async function main() {
  const name = process.env.NAME;
  const symbol = process.env.SYMBOL;
  const baseUri = process.env.BASE_URI;
  if (!name || !symbol || !baseUri) {
    throw new Error("incomplete env variables");
  }

  const erc721Starter = await ethers.getContractFactory("ERC721Starter");
  const contract = await erc721Starter.deploy(name, symbol, baseUri);

  await contract.deployed();

  console.log("Contract deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
