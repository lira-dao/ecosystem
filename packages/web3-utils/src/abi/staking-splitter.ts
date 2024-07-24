export const stakingSplitterAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_ldt",
        type: "address",
      },
      {
        internalType: "address",
        name: "_tbb",
        type: "address",
      },
      {
        internalType: "address",
        name: "_tbs",
        type: "address",
      },
      {
        internalType: "address",
        name: "_tbg",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "_stakers",
        type: "address[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "MAX_RATE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MIN_RATE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_ldt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_tb",
        type: "uint256",
      },
    ],
    name: "calculate",
    outputs: [
      {
        components: [
          {
            components: [
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "ldt",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "tb",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "ldtLiquidity",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "tbLiquidity",
                    type: "uint256",
                  },
                ],
                internalType: "struct RewardsLibrary.Reward",
                name: "liquidity",
                type: "tuple",
              },
              {
                internalType: "uint256",
                name: "ldt",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "tb",
                type: "uint256",
              },
            ],
            internalType: "struct RewardsLibrary.Farm",
            name: "tbb",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "ldt",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "tb",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "ldtLiquidity",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "tbLiquidity",
                    type: "uint256",
                  },
                ],
                internalType: "struct RewardsLibrary.Reward",
                name: "liquidity",
                type: "tuple",
              },
              {
                internalType: "uint256",
                name: "ldt",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "tb",
                type: "uint256",
              },
            ],
            internalType: "struct RewardsLibrary.Farm",
            name: "tbs",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "ldt",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "tb",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "ldtLiquidity",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "tbLiquidity",
                    type: "uint256",
                  },
                ],
                internalType: "struct RewardsLibrary.Reward",
                name: "liquidity",
                type: "tuple",
              },
              {
                internalType: "uint256",
                name: "ldt",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "tb",
                type: "uint256",
              },
            ],
            internalType: "struct RewardsLibrary.Farm",
            name: "tbg",
            type: "tuple",
          },
        ],
        internalType: "struct RewardsLibrary.RewardsAmounts",
        name: "rewards",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ldt",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pendingOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "ldt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tb",
            type: "uint256",
          },
        ],
        internalType: "struct RewardsLibrary.RewardRate",
        name: "_tbbRewardRate",
        type: "tuple",
      },
    ],
    name: "setTbbRewardRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "ldt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tb",
            type: "uint256",
          },
        ],
        internalType: "struct RewardsLibrary.RewardRate",
        name: "_tbgRewardRate",
        type: "tuple",
      },
    ],
    name: "setTbgRewardRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "ldt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "tb",
            type: "uint256",
          },
        ],
        internalType: "struct RewardsLibrary.RewardRate",
        name: "_tbsRewardRate",
        type: "tuple",
      },
    ],
    name: "setTbsRewardRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "stakers",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tbb",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tbbRewardRate",
    outputs: [
      {
        internalType: "uint256",
        name: "ldt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tb",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tbg",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tbgRewardRate",
    outputs: [
      {
        internalType: "uint256",
        name: "ldt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tb",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tbs",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tbsRewardRate",
    outputs: [
      {
        internalType: "uint256",
        name: "ldt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tb",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
