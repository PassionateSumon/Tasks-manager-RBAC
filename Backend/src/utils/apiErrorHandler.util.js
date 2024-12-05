class apiErrorHandler extends Error {
  constructor(code, message) {
    super();
    this.code = code;
    this.message = message;
    this.name = this.constructor.name;
  }
}

module.exports = apiErrorHandler;
