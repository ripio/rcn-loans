import { Agent } from 'environments/environment';
import { Engine } from 'app/models/loan.model';
import { WalletType } from 'app/interfaces/wallet.interface';

const USDC_TOKEN = '0x46f348579e2b93f65fbd0636ad9cee504fcf1e1c';

export const chain = {
  network: {
    id: 80001,
    name: 'Matic',
    currency: 'Matic',
    ui: {
      name: 'Matic Testnet Mumbai',
      fullname: 'Matic Testnet Mumbai (Polygon)',
      image: 'assets/polygon-matic_20.svg',
      website: 'https://docs.matic.today/docs/getting-started'
    },
    explorer: {
      address: 'https://explorer-mumbai.maticvigil.com/address/${address}/transactions',
      tx: 'https://explorer-mumbai.maticvigil.com/tx/${tx}/internal-transactions'
    },
    provider: {
      id: null,
      url: `https://rpc-mumbai.matic.today`
    }
  },
  api: {
    [Engine.UsdcEngine]: {
      v6: `https://bsc-testnet.rcn.loans/`
    }
  },
  contracts: {
    [Engine.UsdcEngine]: {
      token: USDC_TOKEN,
      oracleFactory: '0x831571d93a9912830df872e3d2fc3d0ab5cbbe98',
      diaspore: {
        debtEngine: '0xbe9ab1e0fb3bd625835971cfc7bf25b493eee38b',
        loanManager: '0xb550f51b64d66dfbd4404d39c7fafd414b134de2'
      },
      collateral: {
        collateral: '0x299e2ef286632bc72dfa3c2d945330e9462da288',
        wethManager: '' // FIXME: add contract address
      },
      converter: {
        converterRamp: '', // FIXME: add contract address,
        uniswapConverter: '' // FIXME: add contract address
      },
      models: {
        installments: '0x6ea0c09cbdd6e6eb3cf570d402a747422d8fec0e'
      }
    },
    chainCurrencyAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    chainlink: {
      EACAggregatorProxy: {
        chainCurrencyToUsd: '0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee'
      },
      chainlinkAdapterV3: '' // FIXME: add contract address
    }
  },
  dir: {
    '0xf7c5e867e739f5508c63c8ab22f39c44b9cac0b5': Agent.RipioArsCreator,
    '0xf42d11a0aff8f9a56853e4c41ee333b57658d096': Agent.RipioArsCreator
  },
  currencies: {
    chainlinkPairs: {
      'ETH': ['ETH', 'USD', 'USDC'],
      'BNB': ['BNB', 'USD', 'USDC'],
      'ARS': ['USDC', 'USD', 'BTC', 'ARS'],
      'BTC': ['BTC', 'USD', 'USDC']
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
      },
      {
        symbol: 'ETH',
        img: 'assets/eth.svg',
        address: '0xc1bd46297effa98c87b2f74ada2903ec0f804e1c'
      }
    ],
    currencyDecimals: {
      'USDC': 18
    },
    createLoanCurrencies: ['USDC', 'ETH', 'ARS'],
    createCollateralCurrencies: ['USDC', 'ETH']
  },
  usableWallets: [
    WalletType.Metamask
  ],
  usableEngines: [
    Engine.UsdcEngine
  ]
};