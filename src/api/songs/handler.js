const ClientError = require('../../exceptions/ClientError');
const { postSuccessResponse, clientErrorResponse, serverErrorResponse } = require('../../responses');

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

  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { title, year, performer, genre = undefined, duration = undefined } = request.payload;

      const songId = await this._service.addSong({ title, year, performer, genre, duration });

      return postSuccessResponse(h, 'Lagu berhasil ditambahkan', { songId });
    } catch (error) {
      if (error instanceof ClientError) {
        return clientErrorResponse(h, error);
      }
      return serverErrorResponse(h);
    }
  }

  async getSongsHandler(h) {
    try {
      const songs = await this._service.getSongs();
      return {
        status: 'success',
        data: {
          songs,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return clientErrorResponse(h, error);
      }
      return serverErrorResponse(h);
    }
  }

  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this._service.getSongById(id);
      return {
        status: 'success',
        data: {
          song,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return clientErrorResponse(h, error);
      }
      return serverErrorResponse(h);
    }
  }

  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { id } = request.params;

      await this._service.editSongById(id, request.payload);

      return {
        status: 'success',
        message: 'lagu berhasil diperbarui',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return clientErrorResponse(h, error);
      }
      return serverErrorResponse(h);
    }
  }

  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteSongById(id);

      return {
        status: 'success',
        message: 'lagu berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return clientErrorResponse(h, error);
      }
      return serverErrorResponse(h);
    }
  }
}

module.exports = SongsHandler;
