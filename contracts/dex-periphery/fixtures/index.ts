import hre from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { dexFactoryFixture } from '@lira-dao/dex-core/fixtures';
import { mockWethFixture } from '@lira-dao/mock-tokens/fixtures';
import { liraDaoTokenFixture } from '@lira-dao/ldt/fixtures';


export async function dexRouterFixture() {
  const [deployer, dao, user] = await hre.ethers.getSigners();

  const { dexFactory, dexFactoryAddress } = await loadFixture(dexFactoryFixture);
  const { weth, wethAddress } = await loadFixture(mockWethFixture);
  const { ldt, ldtAddress, vault: ldtVault } = await loadFixture(liraDaoTokenFixture);

  const dexRouterFactory = await hre.ethers.getContractFactory('UniswapV2Router02');
  const dexRouter = await dexRouterFactory.deploy(dexFactoryAddress, wethAddress);
  const dexRouterAddress = await dexRouter.getAddress();

  await dexFactory.createPair(ldtAddress, wethAddress);

  await weth.mint(10n ** 18n);
  await weth.approve(dexRouterAddress, 10n ** 18n);

  // @ts-ignore
  await ldt.connect(ldtVault).transfer(deployer, 10n ** 18n);
  await ldt.approve(dexRouterAddress, 10n ** 18n);

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

  return { dexRouter, dexRouterAddress, deployer, dao, user, ldtAddress, wethAddress };
}
