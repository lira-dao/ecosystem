import hre from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { dexFactoryFixture } from '@lira-dao/dex-core/fixtures';
import { mockWethFixture } from '@lira-dao/mock-tokens/fixtures';
import { treasuryBondBronzeFixture } from '@lira-dao/treasury-tokens/fixtures';
import { parseUnits } from 'ethers';
import { UniswapV2Router02 } from '../typechain-types';
import UniswapV2Router02Artifact from '../artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json';

export async function dexRouterFixture() {
  const [deployer, dao, user] = await hre.ethers.getSigners();

  const { dexFactory, dexFactoryAddress, dexPairFactory } = await loadFixture(dexFactoryFixture);
  const { weth, wethAddress } = await loadFixture(mockWethFixture);

  const { tbb, tbbAddress, ldt, ldtAddress, vault: ldtVault, liquidity: ldtLiquidity } = await loadFixture(treasuryBondBronzeFixture);

  const dexRouterFactory = new hre.ethers.ContractFactory<[string, string], UniswapV2Router02>(UniswapV2Router02Artifact.abi, UniswapV2Router02Artifact.bytecode, deployer);
  const dexRouter = await dexRouterFactory.deploy(dexFactoryAddress, wethAddress);
  const dexRouterAddress = await dexRouter.getAddress();

  await dexFactory.createPair(ldtAddress, wethAddress);
  await dexFactory.createPair(ldtAddress, tbbAddress);

  const tbbPairAddress = await dexFactory.getPair(ldtAddress, tbbAddress);
  const tbbPair = dexPairFactory.attach(tbbPairAddress);

  await weth.mint(10n ** 18n);


  // @ts-ignore
  await ldt.connect(ldtVault).transfer(deployer, await ldt.balanceOf(ldtVault));

  // allowances
  await weth.approve(dexRouterAddress, hre.ethers.MaxUint256);
  await ldt.approve(dexRouterAddress, hre.ethers.MaxUint256);
  await ldt.approve(tbbAddress, hre.ethers.MaxUint256);
  await tbb.approve(dexRouterAddress, hre.ethers.MaxUint256);

  // tbb
  await tbb.setIsMintEnabled(true);
  await tbb.mint(deployer, parseUnits('10', 18));


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
    parseUnits('10000', 18),
    parseUnits('10', 18),
    parseUnits('10000', 18),
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
    ldtLiquidity,
    tbb,
    tbbAddress,
    tbbPair,
    tbbPairAddress,
    user,
    wethAddress,
  };
}
