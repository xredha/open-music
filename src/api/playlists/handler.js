const { postSuccessResponse } = require('../../responses');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistByIdHandler = this.deleteSongFromPlaylistByIdHandler.bind(this);
    this.getUsersByUsernameHandler = this.getUsersByUsernameHandler.bind(this);
  }

  async postPlaylistHandler({ payload, auth }, h) {
    try {
      this._validator.validatePlaylistPayload(payload);
      const { name } = payload;
      const { id: credentialId } = auth.credentials;

      const playlistId = await this._service.addPlaylist({
        name,
        owner: credentialId,
      });

      return postSuccessResponse(h, 'Playlist berhasil ditambahkan', { playlistId });
    } catch (error) {
      return error;
    }
  }

  async getPlaylistsHandler({ auth }) {
    try {
      const { id: credentialId } = auth.credentials;
      const playlists = await this._service.getPlaylists(credentialId);

      return {
        status: 'success',
        data: {
          playlists,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async deletePlaylistByIdHandler({ params, auth }) {
    try {
      const { id: playlistId } = params;
      const { id: credentialId } = auth.credentials;

      await this._service.verifyPlaylistOwner(playlistId, credentialId);
      await this._service.deletePlaylistById(playlistId);

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
      };
    } catch (error) {
      return error;
    }
  }

  async postSongToPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistSongPayload(request.payload);
      const { id: playlistId } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistAccess(playlistId, credentialId);
      await this._service.addSongToPlaylist(playlistId, songId);

      return postSuccessResponse(h, 'Lagu berhasil ditambahkan ke dalam playlist.');
    } catch (error) {
      return error;
    }
  }

  async getSongsFromPlaylistHandler({ params, auth }) {
    try {
      const { id: playlistId } = params;
      const { id: credentialId } = auth.credentials;

      await this._service.verifyPlaylistAccess(playlistId, credentialId);
      const songs = await this._service.getSongsFromPlaylist(playlistId);

      return {
        status: 'success',
        data: {
          songs,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async deleteSongFromPlaylistByIdHandler(request) {
    try {
      const { id: playlistId } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistAccess(playlistId, credentialId);
      await this._service.deleteSongFromPlaylist(playlistId, songId);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      };
    } catch (error) {
      return error;
    }
  }

  async getUsersByUsernameHandler({ query }) {
    try {
      const { username = '' } = query;
      const users = await this._service.getUsersByUsername(username);

      return {
        status: 'success',
        data: {
          users,
        },
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = PlaylistsHandler;
