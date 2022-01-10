export const mobileWallets = (currentUrl) => {
  return []

    //以下は使わない
  return [
    {
      img: require("~/assets/images/mycry-app.jpg"),
      ios: "https://itunes.apple.com/app/%E3%83%9E%E3%82%A4%E3%82%AF%E3%83%AAapp-my-crypto-heroes/id1446976562",
      android: "https://play.google.com/store/apps/details?id=com.tokenpocket.mch"
    },
    {
      img: require("~/assets/images/tokenpocket.png"),
      ios: "https://itunes.apple.com/app/token-pocket/id1288636393",
      android: "https://play.google.com/store/apps/details?id=com.tokenpocket"
    },
    {
      img: require("~/assets/images/gowallet.png"),
      ios: `https://gowallet.onelink.me/SoxJ?pid=app0004&af_sub1=${currentUrl}`,
      android: "https://play.google.com/store/apps/details?id=jp.co.smartapp.gowallet"
    }
  ]
}

export const desktopWallets = [
    {
      img: require("~/assets/images/dl_metamask.png"),
      link: "https://metamask.io/"
    },
  ]
