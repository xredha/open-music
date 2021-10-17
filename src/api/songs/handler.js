const { postSuccessResponse } = require('../../responses');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler({ payload }, h) {
    try {
      this._validator.validateSongPayload(payload);
      const songId = await this._service.addSong(payload);

      return postSuccessResponse(h, 'Lagu berhasil ditambahkan', { songId });
    } catch (error) {
      return error;
    }
  }

  async getSongsHandler() {
    try {
      const songs = await this._service.getSongs();

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

  async getSongByIdHandler({ params }) {
    try {
      const { id } = params;
      const song = await this._service.getSongById(id);

      return {
        status: 'success',
        data: {
          song,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async putSongByIdHandler({ payload, params }) {
    try {
      this._validator.validateSongPayload(payload);
      const { id } = params;
      await this._service.editSongById(id, payload);

      return {
        status: 'success',
        message: 'lagu berhasil diperbarui',
      };
    } catch (error) {
      return error;
    }
  }

  async deleteSongByIdHandler({ params }) {
    try {
      const { id } = params;
      await this._service.deleteSongById(id);

      return {
        status: 'success',
        message: 'lagu berhasil dihapus',
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = SongsHandler;
