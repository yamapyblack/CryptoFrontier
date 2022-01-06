// 機密情報はここに入力しない 必要な場合はAWS SSM経由で
// リリース前のテスト
module.exports = {
    apiBaseUrl: '',
     //mainnet
     contract:	"0xe988A19284CC9ed7512a7d13c61278B6eaB873f8",
     deposit: "0x301Ab4c6b2C69055d5b230C3C55F933cf852931c",
     auction: "0x5e0A1452649F2FbFee05Da8CeB86aB483ba9d1eC",
     weth: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",

     auth: {
        auth_env: "prod",
        client_id: "one-prod",
        redirect_uri: "",
        auth_uri: "https://auth.mch.plus/authorize",
        token_uri: "https://auth.mch.plus/api/token",
        phone_uri: "https://auth.mch.plus/verify-number",
        phone_redirect_uri: "http://localhost:3000/",
        cookie_domain: ""
    },
    network: {
      host: "https://mainnet.infura.io/v3/",
      chainId: 1,
      networkName: "mainnet",
    },
    chainInfo: {
      chainId: 1,
      chainName: 'Ethereum ネットワーク',
      nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
      },
      rpcUrls: ['https://mainnet.infura.io/v3/'],
    }
}

