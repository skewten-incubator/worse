'use strict'

const http = require('http')
const https = require('https')

const SERVER_DEFAULTS = {

}

const SERVER_LISTENER_DEFAULTS = {
  // Host to accept connections from.
  // Can be a String, an Array<String>, or null.
  //
  // Comparison is done on connection upgrade, and it
  // checks against the HTTP 'Host' header.
  //
  // String: Host to accept.
  // Array<String>: List of hosts to accept
  // null: Accept all hosts
  host: null,

  // Path(s) to accept WebSocket connections on.
  // Can be a String, an Array<String>, or null.
  //
  // The listener will create a property on the http(s).Server instances
  // called `_webSocketPaths` (to provide compatibility with the `ws` module),
  // which will be a plain object that follows this format:
  // ```
  // {
  //   '/game': WSServerListener,
  //   '/chat': WSServerListener
  // }
  // ```
  // Servers that accept all paths will use the `_webSocketPaths` property named
  // '%%WSPATHALL%%'.
  //
  // This is so different WebSocket servers do not listen on the same path,
  // causing conflicts.
  //
  // On the HTTP server that the listener created (`server` is not provided),
  // with non-upgrade HTTP requests, it will return `404 Not Found` on every path
  // except the accepted ones, in which it will return `426 Upgrade Required`.
  //
  // String: Path to accept.
  // Array<String>: List of paths to accept.
  // null: Accept all paths
  path: null,

  // Port to have the created HTTP server listen on.
  // Applicable ONLY if `server` is null.
  // Can be a Number, or null.
  //
  // Number: port number to listen on.
  // null (or 0): Listen on any available port.
  port: null,

  // HTTP server to use for upgrade handling.
  // Cannot be used with `port`. If `port` is defined with `server`,
  // the listener creator will throw an error.
  //
  // Must be an instance of nodejs's http.Server or https.Server.
  server: null
}

export class WSServerListenerOptions extends Options {
  constructor (options, defaults) {
    super(options, SERVER_LISTENER_DEFAULTS)

    const host = this.get('host')
    if (
      host &&
      (
        typeof host !== 'string' &&
        !Array.isArray(host)
      )
    ) {
      throw new Error('Invalid value provided for host')
    }

    const path = this.get('path')
    if (
      path &&
      (
        typeof path !== 'string' &&
        !Array.isArray(path)
      )
    ) {
      throw new Error('Invalid value provided for path')
    }

    const port = this.get('port')
    if (port && typeof port !== 'number') {
      throw new Error('Port must be a number or a falsy value')
    }

    const server = this.get('server')
    if (server && port !== null) {
      throw new Error('Either server of port must be defined, not both')
    }
    if (
      server && (
        !(server instanceof http.Server) &&
        !(server instanceof https.Server)
      )
    ) {
      throw new Error('Server is not an instance of http.Server or https.Server')
    }
  }
}

export class WSServerOptions extends Options {
  constructor (options, defaults) {
    super(options, SERVER_DEFAULTS)
  }
}

export class Options {
  constructor (options, defaults) {
    this.options = Object.assign({}, defaults, options)
  }

  get (prop) {
    return this.options[prop]
  }

  set (prop, data) {
    this.options[prop] = data
  }
}
