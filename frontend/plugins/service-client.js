import GraphService from '~/services/graphService.js'

const pluginClient = ({ app },inject) => {
  inject('graphService', new GraphService(app))
}

export default pluginClient
