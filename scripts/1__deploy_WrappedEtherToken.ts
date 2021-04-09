import {Contract, ContractFactory} from "ethers";
import {ethers} from 'hardhat';

async function main(): Promise<void> {
  const WrappedAssetTokenFactory: ContractFactory = await ethers.getContractFactory("WrappedAssetToken__factory");
  const wrappedEthereumContract: Contract = await WrappedAssetTokenFactory.deploy("Wrapped Ethereum Token", "wETH", 18);
  await wrappedEthereumContract.deployed();

  console.log("Wrapped Ethereum Token Contract deployed to: ", wrappedEthereumContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
