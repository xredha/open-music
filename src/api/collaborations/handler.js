const { postSuccessResponse } = require('../../responses');

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler({ payload, auth }, h) {
    try {
      this._validator.validateCollaborationPayload(payload);
      const { id: credentialId } = auth.credentials;
      const { playlistId, userId } = payload;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

      const collaborationId = await this._collaborationsService
        .addCollaboration(playlistId, userId);

      return postSuccessResponse(h, 'Kolaborasi berhasil ditambahkan', { collaborationId });
    } catch (error) {
      return error;
    }
  }

  async deleteCollaborationHandler({ payload, auth }) {
    try {
      this._validator.validateCollaborationPayload(payload);
      const { id: credentialId } = auth.credentials;
      const { playlistId, userId } = payload;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      await this._collaborationsService.deleteCollaboration(playlistId, userId);

      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = CollaborationsHandler;
