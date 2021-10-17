const success = {
  status: 'success',
  code: 201,
};

const postSuccessResponse = (handler, message, data) => {
  const response = handler.response({
    status: success.status,
    message,
    data,
  });
  response.code(success.code);
  return response;
};

module.exports = { postSuccessResponse };
