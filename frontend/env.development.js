// 機密情報はここに入力しない 必要な場合はAWS SSM経由で
module.exports = {
    apiBaseUrl: 'http://host.docker.internal:8080',
     //rinkeby
    contract:	"0x07Acaa0054C6B6f8ffA75A7293A6Dd330067fd05",
    deposit: "0x1A2Db017111161a2d41cd9AB310B95b69D52cAC1",
    auction: "0xbFa5E184bf40fee120d5D7bFcb788A12E66aafcf",
    weth: "0x4330128e83a9Bd01FD9fd96CEb2dAC07061E9a5D", //MOCK

    auth: {
      auth_env: "sand",
      client_id: "hat-local", //localはone-blockのやつは動かない
      redirect_uri: "http://localhost:3000/users/auth/mch/callback",
      auth_uri: "https://auth.mch.plus/authorize",
      token_uri: "https://auth.mch.plus/api/token",
      phone_uri: "https://auth.mch.plus/verify-number",
      phone_redirect_uri: "http://localhost:3000/",
      cookie_domain: ""
    },
    network: {
      host: "https://rinkeby.infura.io/v3/",
      chainId: 4,
      networkName: "rinkeby",
    },
    chainInfo: {
      chainId: 4,
      chainName: 'Rinkeby テスト ネットワーク',
      nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
      },
      rpcUrls: ['https://rinkeby.infura.io/v3/'],
    }
}
