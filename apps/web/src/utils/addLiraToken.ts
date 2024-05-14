import MetaMaskSDK from '@metamask/sdk';

const MMSDK = new MetaMaskSDK({});
export const ethereum = MMSDK.getProvider();

export async function addLiraToken() {
  const tokenAddress = '0xA07ac236fEBc390c798504E927DC8D6a4e1FfcA3';
  const tokenSymbol = 'LIRA';
  const tokenDecimals = 8;
  const tokenImage = 'https://gateway.pinata.cloud/ipfs/QmeDcLiQAZ5VB2s3rzjjMYafU88tVrXLgEsC4Qon7bTaRM';

  try {
    // wasAdded is a boolean. Like any RPC method, an error can be thrown.
    const wasAdded = await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC-20 tokens, but eventually more!
        options: {
          address: tokenAddress, // The address of the token.
          symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 characters.
          decimals: tokenDecimals, // The number of decimals in the token.
          image: tokenImage, // A string URL of the token logo.
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
    // wasAdded is a boolean. Like any RPC method, an error can be thrown.
    const wasAdded = await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC-20 tokens, but eventually more!
        options: {
          address: tokenAddress, // The address of the token.
          symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 characters.
          decimals: tokenDecimals, // The number of decimals in the token.
          image: tokenImage, // A string URL of the token logo.
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
