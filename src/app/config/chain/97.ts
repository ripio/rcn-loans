import { Agent } from 'environments/environment';
import { WalletType } from 'app/interfaces/wallet.interface';

const RCN_ENGINE = 'rcnEngine';
const USDC_ENGINE = 'usdcEngine';
const USDC_TOKEN = '0x46f348579e2b93f65fbd0636ad9cee504fcf1e1c';

export const chain = {
  network: {
    id: 97,
    name: 'Binance',
    currency: 'BNB',
    ui: {
      name: 'Binance',
      fullname: 'Binance Smart Chain Testnet',
      image: 'assets/chain-binance.svg'
    },
    explorer: {
      address: 'https://testnet.bscscan.com/address/${address}',
      tx: 'https://testnet.bscscan.com/tx/${tx}'
    },
    provider: {
      id: null,
      url: `https://data-seed-prebsc-1-s1.binance.org:8545/`
    }
  },
  api: {
    [RCN_ENGINE]: {
      v6: ''
    },
    [USDC_ENGINE]: {
      v6: `https://bsc-testnet.rcn.loans/`
    }
  },
  contracts: {
    [RCN_ENGINE]: {
      token: '',
      oracleFactory: '',
      diaspore: {
        debtEngine: '',
        loanManager: ''
      },
      collateral: {
        collateral: '',
        wethManager: ''
      },
      converter: {
        converterRamp: '',
        uniswapConverter: ''
      },
      models: {
        installments: ''
      }
    },
    [USDC_ENGINE]: {
      token: USDC_TOKEN,
      oracleFactory: '0xbb6dd5143d07ae9e8b766566f2c496394de051bf',
      diaspore: {
        debtEngine: '0xe8a7cd59aaa09a31af9c61e9c6da8d68a81cc198',
        loanManager: '0x4a921888cd77b5951390bc084f8dcbb3c1c3695a'
      },
      collateral: {
        collateral: '0xcdffb372f7fddd9b2d72c59951d55923424ef4e7',
        wethManager: '' // TODO: add WETH Manager for BSC
      },
      converter: {
        converterRamp: '0x280fd3b6ff59e76297c874db7fe2b98175737041',
        uniswapConverter: '0xdba056aba9735cb3ad54f822a7d7fbe6c5ca31f5'
      },
      models: {
        installments: '0x99aca996ebbf0fe42c45379277dc34fd9d83d4fc'
      }
    },
    chainCurrencyAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    chainlink: {
      EACAggregatorProxy: {
        chainCurrencyToUsd: '0xc771cfbba406728e7d2415490b31e3b0d5d8a503'
      },
      chainlinkAdapterV3: '0x774d446f17619c66d0feb5856f7a6bb93ac2b6c1'
    }
  },
  blacklist: [
    {
      key: 'oracle',
      forbidden: [
        '0x0ac18b74b5616fdeaeff809713d07ed1486d0128',
        '0x4931d0621360187199de494a1469165079b31bfc'
      ]
    },
    {
      key: 'oracleUrl',
      forbidden: [
        'http://ec2-54-233-188-146.sa-east-1.compute.amazonaws.com/rate/'
      ]
    }
  ],
  dir: {
    '0xf7c5e867e739f5508c63c8ab22f39c44b9cac0b5': Agent.RipioArsCreator,
    '0xf42d11a0aff8f9a56853e4c41ee333b57658d096': Agent.RipioArsCreator
  },
  filterCurrencies: [
    'ARS',
    'USD'
  ],
  usableCurrencies: [
    {
      symbol: 'BNB',
      img: 'assets/bnb.png',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
    },
    {
      symbol: 'USDC',
      img: 'assets/usdc.png',
      address: USDC_TOKEN
    },
    {
      symbol: 'ARS',
      img: 'assets/ars.png',
      address: '0x0000000000000000000000000000000000000000'
    }
  ],
  usableWallets: [
    WalletType.Metamask
  ]
};