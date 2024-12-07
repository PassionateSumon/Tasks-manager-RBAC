// exports.asyncFuncHandler = (func) => {
//   return (req, res, next) => {
//     Promise.resolve(func(req, res, next)).catch((error) => next(error));
//   };
// };

const asyncFuncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
module.exports = { asyncFuncHandler };
