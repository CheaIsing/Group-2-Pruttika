const sendResponse = (res, statusCode, result, message, data = null) => {
  const response = { result, message };
  if (data) {
    response.data = data;
  }
  res.status(statusCode).json(response);
};

module.exports = { sendResponse };
