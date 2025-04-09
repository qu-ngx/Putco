require('dotenv').config()

const config = {
  server: {
    port: process.env.PORT || 5300,
    clientPort: process.env.CLIENT_PORT || 5173,
    clientPortAlt: process.env.CLIENT_PORT_ALT || 5174
  },
  clientUrls: [
    `http://localhost:${process.env.CLIENT_PORT}`,
    `http://localhost:${process.env.CLIENT_PORT_ALT}`
  ]
}

module.exports = config