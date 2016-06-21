module.exports = {
  timeout: 10000,
  babelify: true,
  bot: {
    floodProtection: 400,
    splitLine: 400,
    maxChars: 760,
    maxCharsPrivate: 2300,
    maxLines: 4,
    maxLinesPrivate: 8,
    timeout: 10000
  },
  inspect: {
    depth: 1,
    colors: false,
    showHidden: false
  },
  BABELIFY: true,
  IRCBOT_MAX_LINES: 4,
  IRCBOT_MAX_CHARS: 760,
  IRCBOT_SPLIT_LINE: 400, 
  IRCBOT_INSPECT_DEPTH: 2,
  IRCBOT_FLOODPROTECTION_DELAY: 400,
  IRCBOT_EXECUTION_TIMEOUT: 10000
};