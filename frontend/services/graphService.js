import {apollo} from "vue-apollo";
import query from "~/apollo/queries/erc721tokens.gql";

export default class GraphService {
  constructor(app) {
    console.log('new GraphService')
    this.app = app
  }

  getConsole() {
    console.log('getConsole')
    return
  }

  // async getNfts(_account){
  //   const res = await apollo.query({
  //     query: query,
  //     variables: {
  //       account: _account,
  //     }
  //   })
  //   return res.data
  // }

}
