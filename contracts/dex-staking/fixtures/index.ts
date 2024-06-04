import { mockTokenFixture } from '@lira-dao/mock-tokens/fixtures';


export async function lpStakerFixture() {
  const { token: lp, tokenAddress: lpAddress } = await mockTokenFixture('LP', 'LP');
  const { token: token1, tokenAddress: token1Address } = await mockTokenFixture('Token1', 'T1');
  const { token: token2, tokenAddress: token2Address } = await mockTokenFixture('Token2', 'T2');

  return { lp, lpAddress, token1, token1Address, token2, token2Address };
}
