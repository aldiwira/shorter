module.exports = {
  CODE_SUCCESS: 200,
  CODE_ERROR: 401,
  CODE_UNAUTHORIZED: 403,
  RESPONSE_SUCCESS: "Data Loaded",
  RESPONSE_ERROR: "Error",
  RESPONSE_WRONG: "Data Error",
  set: (code, massage, data) => {
    if (data == null) {
      data = "";
    }
    return {
      status: code,
      massage: massage,
      data: data,
    };
  },
};
