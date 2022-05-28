import { ethers } from "hardhat";
import { addDays } from "date-fns";

export async function deployContracts(name: string, symbol: string) {
  const erc721Starter = await ethers.getContractFactory("ERC721Starter");
  const now = new Date();
  const erc721StaterContract = await erc721Starter.deploy(
    name,
    symbol,
    "ipfs://myhash/",
    Math.floor(now.getTime() / 1000),
    Math.floor(addDays(now, 7).getTime() / 1000)
  );
  await erc721StaterContract.deployed();

  const conferenceTicket = await ethers.getContractFactory("ConferenceTicket");
  const confereceTicketContract = await conferenceTicket.deploy(
    "Art Conference",
    "ARTC",
    "ipfs://myhash"
  );
  await confereceTicketContract.deployed();
  return {
    erc721StaterContract,
    confereceTicketContract,
  };
}
