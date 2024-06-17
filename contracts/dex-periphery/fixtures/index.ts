import hre from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { dexFactoryFixture } from '@lira-dao/dex-core/fixtures';
import { mockWethFixture } from '@lira-dao/mock-tokens/fixtures';
import { liraDaoTokenFixture } from '@lira-dao/ldt/fixtures';
import {
  treasuryBondBronzeFactory,
  treasuryBondBronzeRate,
  treasuryBondGoldFactory,
  treasuryBondGoldRate,
  treasuryBondSilverFactory,
  treasuryBondSilverRate,
} from '@lira-dao/treasury-tokens/fixtures';
import { parseUnits } from 'ethers';
import { UniswapV2Router02 } from '../typechain-types';
import UniswapV2Router02Artifact from '../artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json';

export async function dexRouterFixture() {
  const [deployer, dao, user] = await hre.ethers.getSigners();

  const { dexFactory, dexFactoryAddress, dexPairFactory } = await loadFixture(dexFactoryFixture);
  const { weth, wethAddress } = await loadFixture(mockWethFixture);

  const { ldt, ldtAddress, vault: ldtVault, liquidity: ldtLiquidity, team: ldtTeam } = await loadFixture(liraDaoTokenFixture);
  // @ts-ignore
  await ldt.connect(ldtLiquidity).transfer(deployer, await ldt.balanceOf(ldtLiquidity));

  const tbb = await treasuryBondBronzeFactory.connect(deployer).deploy(ldtAddress, treasuryBondBronzeRate);
  const tbbAddress = await tbb.getAddress();

  const tbs = await treasuryBondSilverFactory.connect(deployer).deploy(ldtAddress, treasuryBondSilverRate);
  const tbsAddress = await tbs.getAddress();

  const tbg = await treasuryBondGoldFactory.connect(deployer).deploy(ldtAddress, treasuryBondGoldRate);
  const tbgAddress = await tbg.getAddress();

  const dexRouterFactory = new hre.ethers.ContractFactory<[string, string], UniswapV2Router02>(UniswapV2Router02Artifact.abi, UniswapV2Router02Artifact.bytecode, deployer);
  const dexRouter = await dexRouterFactory.deploy(dexFactoryAddress, wethAddress);
  const dexRouterAddress = await dexRouter.getAddress();

  await dexFactory.createPair(ldtAddress, wethAddress);
  await dexFactory.createPair(ldtAddress, tbbAddress);
  await dexFactory.createPair(ldtAddress, tbsAddress);
  await dexFactory.createPair(ldtAddress, tbgAddress);

  const tbbPairAddress = await dexFactory.getPair(ldtAddress, tbbAddress);
  const tbbPair = dexPairFactory.attach(tbbPairAddress);

  const tbsPairAddress = await dexFactory.getPair(ldtAddress, tbsAddress);
  const tbsPair = dexPairFactory.attach(tbsPairAddress);

  const tbgPairAddress = await dexFactory.getPair(ldtAddress, tbgAddress);
  const tbgPair = dexPairFactory.attach(tbgPairAddress);

  await weth.mint(10n ** 18n);

  // @ts-ignore
  await ldt.connect(ldtVault).transfer(deployer, await ldt.balanceOf(ldtVault));

  // allowances
  await weth.approve(dexRouterAddress, hre.ethers.MaxUint256);
  await ldt.approve(dexRouterAddress, hre.ethers.MaxUint256);
  await ldt.approve(tbbAddress, hre.ethers.MaxUint256);
  await ldt.approve(tbsAddress, hre.ethers.MaxUint256);
  await ldt.approve(tbgAddress, hre.ethers.MaxUint256);
  await tbb.approve(dexRouterAddress, hre.ethers.MaxUint256);
  await tbs.approve(dexRouterAddress, hre.ethers.MaxUint256);
  await tbg.approve(dexRouterAddress, hre.ethers.MaxUint256);

  // tbb
  await tbb.setIsMintEnabled(true);
  await tbb.mint(deployer, parseUnits('1000', 18));

  // tbs
  await tbs.setIsMintEnabled(true);
  await tbs.mint(deployer, parseUnits('100', 18));

  // tbg
  await tbg.setIsMintEnabled(true);
  await tbg.mint(deployer, parseUnits('10', 18));

  await dexRouter.addLiquidity(
    ldtAddress,
    wethAddress,
    10n ** 18n,
    10n ** 18n,
    10n ** 18n,
    10n ** 18n,
    deployer,
    999999999999999,
  );

  await dexRouter.addLiquidity(
    ldtAddress,
    tbbAddress,
    parseUnits('1000000', 18),
    parseUnits('1000', 18),
    parseUnits('1000000', 18),
    parseUnits('1000', 18),
    deployer,
    999999999999999,
  );

  await dexRouter.addLiquidity(
    ldtAddress,
    tbsAddress,
    parseUnits('1000000', 18),
    parseUnits('100', 18),
    parseUnits('1000000', 18),
    parseUnits('100', 18),
    deployer,
    999999999999999,
  );

  await dexRouter.addLiquidity(
    ldtAddress,
    tbgAddress,
    parseUnits('1000000', 18),
    parseUnits('10', 18),
    parseUnits('1000000', 18),
    parseUnits('10', 18),
    deployer,
    999999999999999,
  );

  return {
    dao,
    deployer,
    dexRouter,
    dexRouterAddress,
    ldt,
    ldtAddress,
    ldtVault,
    ldtLiquidity,
    ldtTeam,
    tbb,
    tbbAddress,
    tbs,
    tbsAddress,
    tbg,
    tbgAddress,
    tbbPair,
    tbbPairAddress,
    tbsPair,
    tbsPairAddress,
    tbgPair,
    tbgPairAddress,
    user,
    wethAddress,
  };
}
