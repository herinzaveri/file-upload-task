module.exports = function makeFormatting() {
  return async function formatting(req, res, next) {
    res.formatResponse = async ({contentType, statusCode, body, headers}) => {
      headers = headers ? headers : {};
      statusCode = statusCode ? statusCode : 200;
      const formattedResponse = {
        statusCode: statusCode,
      };

      if (body instanceof Error) {
        formattedResponse.body = {
          message: body.message,
          name: body.name,
          code: body.errorCode,
        };
        headers['content-type'] = 'application/json';
      } else {
        formattedResponse.body = body;
        headers['content-type'] = contentType ?
          contentType :
          'application/json';
      }

      return await res.set(headers).status(statusCode).send(formattedResponse);
    };

    res.formatError = async ({error}) => {
      return await res.formatResponse({
        statusCode: error.httpStatusCode || 200,
        body: {
          message: error.message,
          name: error.name,
          code: error.errorCode || 400,
        },
      });
    };

    next();
  };
};
