import config from '../config'
import server from '../server/main'
import _debug from 'debug'

const debug = _debug('app:bin:server')
const port = config.server_port
const extport = config.server_external_port
const host = config.server_host
const proto = config.server_proto

server.listen(port)
debug(`Server is now running at ${proto}://${host}:${extport}.`)
debug(`Server accessible via localhost:${port} if you are using the project defaults.`)
