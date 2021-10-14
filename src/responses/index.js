const success = {
  status: 'success',
  code: 201,
};
const error = {
  status: 'error',
  message: 'Maaf, terjadi kegagalan pada server kami.',
  code: 500,
};
const fail = {
  status: 'fail',
};

const postSuccessResponse = (handler, message, data) => {
  const response = handler.response({
    status: success.status,
    message,
    data,
  });
  response.code(201);
  return response;
};

const clientErrorResponse = (handler, errorCatch) => {
  const response = handler.response({
    status: fail.status,
    message: errorCatch.message,
  });
  response.code(errorCatch.statusCode);
  return response;
};

const serverErrorResponse = (handler) => {
  const response = handler.response({
    status: error.status,
    message: error.message,
  });
  response.code(500);
  return response;
};

module.exports = { postSuccessResponse, clientErrorResponse, serverErrorResponse };
