import { ethers } from "hardhat";
import { config } from "dotenv";

config();

async function main() {
  const name = process.env.NAME;
  const symbol = process.env.SYMBOL;
  const baseUri = process.env.BASE_URI;
  const privSaleStart = Number(process.env.PRIVATE_SALE_START) || 0;
  const privSaleEnd = Number(process.env.PRIVATE_SALE_END || 0);
  const confName = process.env.CONF_NAME;
  const confSymbol = process.env.CONF_SYMBOL;
  const confBaseUri = process.env.CONF_BASE_URI;
  if (
    !name ||
    !symbol ||
    !baseUri ||
    !privSaleStart ||
    !privSaleEnd ||
    !confName ||
    !confSymbol ||
    !confBaseUri
  ) {
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

  const conferenceFactory = await ethers.getContractFactory("ConferenceTicket");
  const conferenceContract = await conferenceFactory.deploy(
    confName,
    confSymbol,
    confBaseUri,
    contract.address
  );
  await conferenceContract.deployed();

  console.log("Conference contract deploy to: ", conferenceContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
