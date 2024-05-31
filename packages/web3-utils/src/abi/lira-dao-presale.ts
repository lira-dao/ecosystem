export const liraDaoPresaleAbi = [
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': '_token',
        'type': 'address',
      },
      {
        'internalType': 'address',
        'name': '_vault',
        'type': 'address',
      },
    ],
    'stateMutability': 'nonpayable',
    'type': 'constructor',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'previousOwner',
        'type': 'address',
      },
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'newOwner',
        'type': 'address',
      },
    ],
    'name': 'OwnershipTransferred',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'internalType': 'address',
        'name': 'to_',
        'type': 'address',
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'input_',
        'type': 'uint256',
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'output_',
        'type': 'uint256',
      },
    ],
    'name': 'Sell',
    'type': 'event',
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256',
      },
    ],
    'name': '_rounds',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': 'bonus',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': 'start',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': 'end',
        'type': 'uint256',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'owner',
    'outputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'renounceOwnership',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'round',
    'outputs': [
      {
        'components': [
          {
            'internalType': 'uint256',
            'name': 'bonus',
            'type': 'uint256',
          },
          {
            'internalType': 'uint256',
            'name': 'start',
            'type': 'uint256',
          },
          {
            'internalType': 'uint256',
            'name': 'end',
            'type': 'uint256',
          },
        ],
        'internalType': 'struct LiraDaoPresale.Round',
        'name': 'round_',
        'type': 'tuple',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'sendViaCall',
    'outputs': [],
    'stateMutability': 'payable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint256[]',
        'name': 'bonuses_',
        'type': 'uint256[]',
      },
      {
        'internalType': 'uint256',
        'name': 'duration_',
        'type': 'uint256',
      },
    ],
    'name': 'start',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'started',
    'outputs': [
      {
        'internalType': 'bool',
        'name': 'started_',
        'type': 'bool',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'token',
    'outputs': [
      {
        'internalType': 'contract IERC20',
        'name': '',
        'type': 'address',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'newOwner',
        'type': 'address',
      },
    ],
    'name': 'transferOwnership',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'vault',
    'outputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'stateMutability': 'payable',
    'type': 'receive',
  },
] as const;
