const routes = (handler) => [
  {
    method: 'POST',
    path: '/exports/playlists/{id}',
    handler: handler.postExportPlaylistHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
