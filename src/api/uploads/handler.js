const path = require('path');
const { postSuccessResponse } = require('../../responses');

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
    this.getUploadImageHandler = this.getUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    try {
      const { data } = request.payload;
      this._validator.validateImageHeaders(data.hapi.headers);

      const pictureUrl = await this._service.writeFile(data, data.hapi);

      return postSuccessResponse(h, 'Gambar berhasil diunggah', {
        pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/pictures/${pictureUrl}`,
      });
    } catch (error) {
      return error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getUploadImageHandler(request, h) {
    const { filename } = request.params;
    const filePath = path.resolve(
      __dirname,
      'file/images',
      filename,
    );
    return h.file(filePath);
  }
}

module.exports = UploadsHandler;
