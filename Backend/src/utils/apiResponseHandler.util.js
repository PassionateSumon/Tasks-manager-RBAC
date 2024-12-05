class apiResponseHandler {
  constructor(code, message, data) {
    (this.code = code), (this.message = message), (this.data = data);
  }
}

module.exports = apiResponseHandler;
