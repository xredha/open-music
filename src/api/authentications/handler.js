const ClientError = require('../../exceptions/ClientError');
const { postSuccessResponse, clientErrorResponse, serverErrorResponse } = require('../../responses');

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler({ payload }, h) {
    try {
      this._validator.validatePostAuthenticationPayload(payload);

      const { username, password } = payload;

      const id = await this._usersService.verifyUserCredential(username, password);

      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });

      await this._authenticationsService.addRefreshToken(refreshToken);

      return postSuccessResponse(h, 'Authentication berhasil ditambahkan', { accessToken, refreshToken });
    } catch (error) {
      if (error instanceof ClientError) {
        return clientErrorResponse(h, error);
      }
      return serverErrorResponse(h);
    }
  }

  async putAuthenticationHandler({ payload }, h) {
    try {
      this._validator.validatePutAuthenticationPayload(payload);

      const { refreshToken } = payload;

      await this._authenticationsService.verifyRefreshToken(refreshToken);

      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

      const accessToken = this._tokenManager.generateAccessToken({ id });
      return {
        status: 'success',
        message: 'Access Token berhasil diperbarui',
        data: {
          accessToken,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return clientErrorResponse(h, error);
      }
      return serverErrorResponse(h);
    }
  }

  async deleteAuthenticationHandler({ payload }, h) {
    try {
      this._validator.validateDeleteAuthenticationPayload(payload);

      const { refreshToken } = payload;

      await this._authenticationsService.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      return {
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return clientErrorResponse(h, error);
      }
      return serverErrorResponse(h);
    }
  }
}

module.exports = AuthenticationsHandler;
