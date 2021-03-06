const { postSuccessResponse } = require('../../responses');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  async postUserHandler({ payload }, h) {
    try {
      this._validator.validateUserPayload(payload);
      const userId = await this._service.addUser(payload);

      return postSuccessResponse(h, 'User berhasil ditambahkan', { userId });
    } catch (error) {
      return error;
    }
  }

  async getUserByIdHandler({ params }) {
    try {
      const { id } = params;
      const user = await this._service.getUserById(id);

      return {
        status: 'success',
        data: {
          user,
        },
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = UsersHandler;
