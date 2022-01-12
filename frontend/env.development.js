// 機密情報はここに入力しない 必要な場合はAWS SSM経由で
module.exports = {
    //mumbai
    FROStatus: "0x0e3EA9Fb71FF871A3a2dFE9F4B80b44D6614ae51",
    FROHp: "0x470E38A5422Add8567a64748aAA51Fa36c1d3002",
    FROSvg: "0x9ba659388F3F11228aDB3336027af6522BA81c35",
    FROTokenDescriptor: "0xAda3D5820bAB9380460beDC43b0EffEE75ca5709",
    FROCharacter: "0xfa2cB59be9D3b591AF1D4001a27D3bB974d3b8c0",
    FROMintLogic: "0x77776B57dcE93577a3537aF466Bfe46eC596eeC8",
    FROReward: "0x03eE11b6f210Ef41De0088AF878F4516aee0fc45",
    FROStaking: "0x079D3f3CE972372D12e21829a784e073984DF6fa",
    FROToken: "0x1A413892570E6837baF45E7355a7c2bC8656BF46",
    FROFrontier: "0xD8F3Df0C9BEa30C1217641bBCd8241f18cd70f8D",
    FROLogic: "0x69b187B5a7C0b46388d852D032FC2a93eC02Fd16",

    chainId: 80001,

    chainInfo: {
      chainId: '0x13881',
      chainName: 'mumbai',
      nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
      },
      rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
    }
}
