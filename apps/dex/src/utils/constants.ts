type TokenProps = {
  address: string;
  symbol: string;
  decimals: number;
  image?: string;
  isNative?: boolean;
};

export const LDTtoken: TokenProps = {
  address: "0x2a5e22b32b3e0daa7a8c199e10df9d9e1264fd3f",
  symbol: "LDT",
  decimals: 18,
  isNative: false
};
