import { ethers } from "hardhat";
import { config } from "dotenv";

config();

async function main() {
  const name = process.env.NAME;
  const symbol = process.env.SYMBOL;
  const baseUri = process.env.BASE_URI;
  const privSaleStart = Number(process.env.PRIVATE_SALE_START) || 0;
  const privSaleEnd = Number(process.env.PRIVATE_SALE_END || 0);
  if (!name || !symbol || !baseUri || !privSaleStart || !privSaleEnd) {
    throw new Error("incomplete env variables");
  }

  const erc721Starter = await ethers.getContractFactory("ERC721Starter");
  const contract = await erc721Starter.deploy(
    name,
    symbol,
    baseUri,
    privSaleStart,
    privSaleEnd
  );

  await contract.deployed();

  console.log("Contract deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
