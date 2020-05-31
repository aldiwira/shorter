module.exports = {
  SALT_CODE: 10,
  CODE_SUCCESS: 200,
  CODE_CREATED: 201,
  CODE_ERROR: 400,
  CODE_UNAUTHORIZED: 401,
  CODE_REJECT: 403,
  RESPONSE_CREATED: "Data created",
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
