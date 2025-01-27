const handleResponseError = (res, error) => {
  console.error("Database error occurred");
  console.error("Error : ", error);
  res
    .status(500)
    .json({ result: false, message: "Internal server error", error: error });
};

const handleValidateError = (error, res) => {
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    res.status(400).json({
      result: false,
      message: errorMessages,
    });
    return true;
  }
  return false;
};

module.exports = {
  handleResponseError,
  handleValidateError,
};
