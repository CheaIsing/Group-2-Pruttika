const sendResponse = (res, statusCode, result, message, data = null) => {
  const response = { result, message };
  if (data) {
    response.data = data;
  }
  res.status(statusCode).json(response);
};
const sendResponse1 = (res, statusCode, result, message, data = null,paginate=null) => {
  const response = { result, message };
  if (data) {
    response.data = data;
  }
  if (paginate) {
    response.paginate = paginate;
  }
  res.status(statusCode).json(response);
};

module.exports = { sendResponse ,sendResponse1};
