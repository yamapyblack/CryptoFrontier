const environment = process.env.NODE_ENV || "development";
const envSet = require(`./env.${environment}.js`);
console.log(process.env.NODE_ENV);

export default {
  env: envSet,
  title:
    "CryptoFrontier: Fully On-chained and decentralized NFT Gaming",
  head: {
    title:
      "CryptoFrontier: Fully On-chained and decentralized NFT Gaming",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content:
          "CryptoFrontier is the Fully On-chained and truly Decentralized Gaming. You explore new frontiers and earn FRO Token.",
      },
      {
        hid: "keywords",
        name: "keywords",
        content: "NFT,Crypto,Marketplace,Sneaker,shoes,fashion",
      },
      { hid: "author", name: "author", content: "CryptoFrontier" },

      {
        hid: "og:description",
        property: "og:description",
        content:
          "CryptoFrontier is the Fully On-chained and truly Decentralized Gaming. You explore new frontiers and earn FRO Token.",
      },
      {
        hid: "og:image",
        property: "og:image",
        content: "https://crypto-frontier.vercel.app/img/main.png",
      },
      { hid: "og:site_name", property: "og:site_name", content: "CryptoFrontier" },
      {
        hid: "og:title",
        property: "og:title",
        content:
          "CryptoFrontier: Fully On-chained and decentralized NFT Gaming",
      },
      { hid: "og:type", property: "og:type", content: "website" },
      { hid: "og:url", property: "og:url", content: "https://crypto-frontier.vercel.app" },
      {
        hid: "twitter:card",
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        hid: "twitter:image",
        name: "twitter:image",
        content: "https://crypto-frontier.vercel.app/img/main.png",
      },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }, 
    ],
  },
  css: ["@/assets/css/common.css"],
  plugins: [
    { src: "~/plugins/env" },
    { src: "~/plugins/ethereum-client", ssr: false },
    // { src: "~/plugins/service-client",  ssr: false },
  ],
  components: true,
  buildModules: [
    'nuxt-windicss',
    '@nuxtjs/vuetify',
    "@nuxtjs/svg",
  ],
  modules: [
    '@nuxtjs/apollo',
  ],
  // Apollo module configuration
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: envSet.graphEndpoint,
      }
    }
  },
  svg: {
    vueSvgLoader: {
        // vue-svg-loader options
    },
    svgSpriteLoader: {
        // svg-sprite-loader options
    },
    fileLoader: {
        // file-loader options
    }
  },
  build: {
    extend(config, ctx) {},
  },
};
