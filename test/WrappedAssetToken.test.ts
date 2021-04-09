import hre from "hardhat";
import {Artifact} from "hardhat/types";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import {Signers} from "../types";
import {WrappedAssetToken} from "../typechain";
import {expect} from "chai";

const {deployContract} = hre.waffle;

describe("WrappedAssetToken", function () {
  let signer = {} as Signers;
  let signers: SignerWithAddress[];
  let wrappedToken: WrappedAssetToken;

  before(async () => {
    const getSignersResult = await hre.ethers.getSigners()
    signers = getSignersResult;
    signer = {
      admin: getSignersResult[0]
    };
  });

  beforeEach(async () => {
    const wrappedTokenArtifact: Artifact = await hre.artifacts.readArtifact("WrappedAssetToken");
    wrappedToken = <WrappedAssetToken>await deployContract(signer.admin, wrappedTokenArtifact, ["Wrapped Ethereum Token", "wETH", 18]);
  });

  it('should have been deployed with the correct constructor values set', async () => {
    expect(await wrappedToken.totalSupply()).to.equal(0);
    expect(await wrappedToken.decimals()).to.equal(18);
    expect(await wrappedToken.name()).to.equal("Wrapped Ethereum Token");
    expect(await wrappedToken.symbol()).to.equal("wETH");
  });

  it('should allow the admin to mint new coins', async () => {
    expect(await wrappedToken.balanceOf(signers[1].address)).to.equal(0);
    await wrappedToken.connect(signer.admin).mint(signers[1].address, 1000);
    expect(await wrappedToken.balanceOf(signers[1].address)).to.equal(1000);
  });

  it('should not allow a non-admin address to mint new coins', async () => {
    expect(await wrappedToken.balanceOf(signers[1].address)).to.equal(0);
    await expect(wrappedToken.connect(signers[1]).mint(signers[1].address, 1000))
      .to.be.revertedWith("ERC20PresetMinterPauser: must have minter role to mint")
    expect(await wrappedToken.balanceOf(signers[1].address)).to.equal(0);
  });

  it('when requestUnwrap is called, should emit UnwrapRequested event with the right info', async () => {
    await wrappedToken.connect(signer.admin).mint(signers[1].address, 1000);

    await expect(wrappedToken.connect(signers[1]).requestUnwrap(1000))
      .to.emit(wrappedToken, 'UnwrapRequested')
      .withArgs(signers[1].address, 1000);
  });

  it('should not allow a User to call requestUnwrap with an amount greater than their wrapped balance', async () => {
    await expect(wrappedToken.connect(signers[1]).requestUnwrap(1000))
      .to.be.revertedWith("WrappedToken: requested unwrap amount exceeds balance")
  });
});

