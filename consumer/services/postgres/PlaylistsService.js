const { Pool } = require('pg');

class PlaylistsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async getPlaylistName(playlistId) {
    try {
      const query = {
        text: 'SELECT name FROM playlists WHERE id = $1',
        values: [playlistId],
      };
      const { rows } = await this._pool.query(query);
      return rows[0].name;
    } catch (error) {
      return error;
    }
  }

  async getSongsFromPlaylist(playlistId) {
    try {
      const result = await this._cacheService.get(`playlist:${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT songs.id, songs.title, songs.performer
        FROM songs
        JOIN playlistsongs
        ON songs.id = playlistsongs.song_id WHERE playlistsongs.playlist_id = $1`,
        values: [playlistId],
      };
      const { rows } = await this._pool.query(query);
      await this._cacheService.set(`playlist:${playlistId}`, JSON.stringify(rows));
      return rows;
    }
  }
}

module.exports = PlaylistsService;
