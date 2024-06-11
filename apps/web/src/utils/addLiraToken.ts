import MetaMaskSDK from '@metamask/sdk';

// TODO: Move

const MMSDK = new MetaMaskSDK({});
export const ethereum = MMSDK.getProvider();

export async function addLiraToken() {
  const tokenAddress = '0xA07ac236fEBc390c798504E927DC8D6a4e1FfcA3';
  const tokenSymbol = 'LIRA';
  const tokenDecimals = 8;
  const tokenImage = 'https://gateway.pinata.cloud/ipfs/QmeDcLiQAZ5VB2s3rzjjMYafU88tVrXLgEsC4Qon7bTaRM';

  try {
    const wasAdded = await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: tokenImage,
        },
      },
    });

    if (wasAdded) {
      console.log('Thanks for your interest!');
    } else {
      console.log('Not added, maybe next time?');
    }
  } catch (error) {
    console.log(error);
  }
}

export async function addLiraDaoToken() {
  const tokenAddress = '0x2A5E22b32b3E0Daa7a8C199e10Df9D9E1264Fd3f';
  const tokenSymbol = 'LDT';
  const tokenDecimals = 18;
  const tokenImage = 'https://gateway.pinata.cloud/ipfs/QmQb1SsLMRdgUA1UPP5ZAn1ZryMifvFrKaUQGY1Mqdb3sy';

  try {
    const wasAdded = await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: tokenImage,
        },
      },
    });

    if (wasAdded) {
      console.log('Thanks for your interest!');
    } else {
      console.log('Not added, maybe next time?');
    }
  } catch (error) {
    console.log(error);
  }
}

export async function addTreasuryBondBronzeToken() {
  const tokenAddress = '0x9C0385b4F1f3B277ab352B817fC56763081a503c';
  const tokenSymbol = 'TBb';
  const tokenDecimals = 18;
  const tokenImage = 'https://gateway.pinata.cloud/ipfs/QmXdXZZL6ReTv5112xr88UhZHg4bj8TZqxFHiYu84WrmsR';

  try {
    const wasAdded = await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: tokenImage,
        },
      },
    });

    if (wasAdded) {
      console.log('Thanks for your interest!');
    } else {
      console.log('Not added, maybe next time?');
    }
  } catch (error) {
    console.log(error);
  }
}

export async function addTreasuryBondSilverToken() {
  const tokenAddress = '0x4bB0Eb07a8ECDcF5f434095Aa34Cc3f69292bcA1';
  const tokenSymbol = 'TBs';
  const tokenDecimals = 18;
  const tokenImage = 'https://gateway.pinata.cloud/ipfs/QmXdXZZL6ReTv5112xr88UhZHg4bj8TZqxFHiYu84WrmsR';

  try {
    const wasAdded = await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: tokenImage,
        },
      },
    });

    if (wasAdded) {
      console.log('Thanks for your interest!');
    } else {
      console.log('Not added, maybe next time?');
    }
  } catch (error) {
    console.log(error);
  }
}

export async function addTreasuryBondGoldToken() {
  const tokenAddress = '0xDB0aEb568EfE3598e9A58407c8b52BcFaC2c11e5';
  const tokenSymbol = 'TBg';
  const tokenDecimals = 18;
  const tokenImage = 'https://gateway.pinata.cloud/ipfs/QmXdXZZL6ReTv5112xr88UhZHg4bj8TZqxFHiYu84WrmsR';

  try {
    const wasAdded = await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: tokenImage,
        },
      },
    });

    if (wasAdded) {
      console.log('Thanks for your interest!');
    } else {
      console.log('Not added, maybe next time?');
    }
  } catch (error) {
    console.log(error);
  }
}