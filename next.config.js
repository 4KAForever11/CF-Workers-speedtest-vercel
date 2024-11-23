module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/speedtest',
        destination: '/api/speedtest'
      }
    ];
  }
} 