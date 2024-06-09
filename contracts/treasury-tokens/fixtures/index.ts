import hre from 'hardhat';
import { liraFixture } from '@lira-dao/satoshi-lira/fixtures';
import { liraDaoTokenFixture } from '@lira-dao/ldt/fixtures';
import { LTBb, LTBg, LTBs, TBb, TBg, TBs } from '../typechain-types';
import LTBBArtifact from '../artifacts/contracts/LTBb.sol/LTBb.json';
import TBBArtifact from '../artifacts/contracts/TBb.sol/TBb.json';
import LTBSArtifact from '../artifacts/contracts/LTBs.sol/LTBs.json';
import TBSArtifact from '../artifacts/contracts/TBs.sol/TBs.json';
import LTBGArtifact from '../artifacts/contracts/LTBg.sol/LTBg.json';
import TBGArtifact from '../artifacts/contracts/TBg.sol/TBg.json';


export async function liraTreasuryBondBronzeFixture() {
  const { lira, liraAddress, wbtc } = await liraFixture();

  const [owner, minter] = await hre.ethers.getSigners();

  const ltbbFactory = new hre.ethers.ContractFactory<[string, bigint], LTBb>(LTBBArtifact.abi, LTBBArtifact.bytecode, owner);
  const ltbb = await ltbbFactory.deploy(liraAddress, 10n ** 5n);
  const ltbbAddress = await ltbb.getAddress();

  return { ltbb, ltbbAddress, lira, liraAddress, wbtc, owner, minter };
}

export async function treasuryBondBronzeFixture() {
  const { ldt, ldtAddress, vault, liquidity } = await liraDaoTokenFixture();

  const [owner, minter] = await hre.ethers.getSigners();

  const tbbFactory = new hre.ethers.ContractFactory<[string, bigint], TBb>(TBBArtifact.abi, TBBArtifact.bytecode, owner);
  const tbb = await tbbFactory.deploy(ldtAddress, 10n ** 3n);
  const tbbAddress = await tbb.getAddress();

  return { tbb, tbbAddress, ldt, ldtAddress, owner, minter, vault, liquidity };
}

export async function liraTreasuryBondSilverFixture() {
  const { lira, liraAddress } = await liraFixture();

  const [owner, minter] = await hre.ethers.getSigners();

  const ltbsFactory = new hre.ethers.ContractFactory<[string, bigint], LTBs>(LTBSArtifact.abi, LTBSArtifact.bytecode, owner);
  const ltbs = await ltbsFactory.deploy(liraAddress, 10n ** 6n);
  const ltbsAddress = await ltbs.getAddress();

  return { ltbs, ltbsAddress, lira, liraAddress, owner, minter };
}

export async function treasuryBondSilverFixture() {
  const { ldt, ldtAddress } = await liraDaoTokenFixture();

  const [owner, minter] = await hre.ethers.getSigners();

  const tbsFactory = new hre.ethers.ContractFactory<[string, bigint], TBs>(TBSArtifact.abi, TBSArtifact.bytecode, owner);
  const tbs = await tbsFactory.deploy(ldtAddress, 10n ** 4n);
  const tbsAddress = await tbs.getAddress();

  return { tbs, tbsAddress, ldt, ldtAddress, owner, minter };
}

export async function liraTreasuryBondGoldFixture() {
  const { lira, liraAddress } = await liraFixture();

  const [owner, minter] = await hre.ethers.getSigners();

  const ltbgFactory = new hre.ethers.ContractFactory<[string, bigint], LTBg>(LTBGArtifact.abi, LTBGArtifact.bytecode, owner);
  const ltbg = await ltbgFactory.deploy(liraAddress, 10n ** 7n);
  const ltbgAddress = await ltbg.getAddress();

  return { ltbg, ltbgAddress, lira, liraAddress, owner, minter };
}

export async function treasuryBondGoldFixture() {
  const { ldt, ldtAddress } = await liraDaoTokenFixture();

  const [owner, minter] = await hre.ethers.getSigners();

  const tbgFactory = new hre.ethers.ContractFactory<[string, bigint], TBg>(TBGArtifact.abi, TBGArtifact.bytecode, owner);
  const tbg = await tbgFactory.deploy(ldtAddress, 10n ** 5n);
  const tbgAddress = await tbg.getAddress();

  return { tbg, tbgAddress, ldt, ldtAddress, owner, minter };
}
