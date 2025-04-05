import hardhat from "hardhat"; // Import Hardhat
const { ethers } = hardhat;

async function main() {
  const MediShare = await ethers.getContractFactory("Medishare"); // Ensure this is your correct contract name
  const contract = await MediShare.deploy(); // Deploy contract

  await contract.waitForDeployment(); // Wait for contract deployment

  console.log("Contract deployed to:", await contract.getAddress()); // Get contract address
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
