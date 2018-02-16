/**
 * callbag-to-pull-stream
 * ----------------------
 *
 * Convert a pullable callbag source to a pull-stream source.
 *
 * `npm install callbag-to-pull-stream`
 *
 * Example:
 *
 *     const pull = require('pull-stream');
 *     const {fromIter, pipe, filter, map} = require('callbag-basics');
 *     const toPullStream = require('callbag-to-pull-stream');
 *
 *     const source = pipe(
 *       fromIter([1,3,5,7,9]),
 *       filter(x => x !== 5), // 1,3,7,9
 *       map(x => x * 10) // 10,30,70,90
 *     )
 *
 *     pull(
 *       toPullStream(source),
 *       pull.filter(x => x !== 30), // 10,70,90
 *       pull.drain(x => console.log(x))
 *     )
 */

function toPullStream(source) {
  let talkback;
  let cb;
  source(0, (t, d) => {
    let _cb = cb;
    cb = void 0;
    if (t === 0) talkback = d;
    if (t === 1 && _cb) _cb(null, d);
    if (t === 2 && _cb) _cb(d || true), talkback = void 0;
  });
  return function (end, _cb) {
    cb = _cb;
    if (end) {
      if (talkback) talkback(2, end === true ? void 0 : end);
      if (cb) cb(end);
      return;
    }
    if (talkback) talkback(1);
    else cb(true);
  };
}

module.exports = toPullStream;
