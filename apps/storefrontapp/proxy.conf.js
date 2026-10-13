const bffBaseUrl =
  process.env['CX_BFF_BASE_URL'] || 'https://localhost:8482/bff/api';
const bffTarget = new URL(bffBaseUrl).origin;

module.exports = {
  '/bff': {
    target: bffTarget,
    secure: false,
    changeOrigin: true,
    ws: false,
    logLevel: 'info',
  },
};
