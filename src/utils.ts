const logger = {
  getTimeStamp: (): string => new Date().toISOString(),
  info(namespace: string, message: string, object?: any) {
    if (object) {
      console.log(
        `[${this.getTimeStamp()}] [INFO] [${namespace}] [${message}]`,
        object,
      );
    } else {
      console.log(
        `[${this.getTimeStamp()}] [INFO] [${namespace}] [${message}]`,
      );
    }
  },
};

/*  '("55", "female", "33", "{"somecrap":["rrr","xxx"]}", "Red lady")'  -- replace " before { with '
 */
const fixBracketsJSON = (query: string): string => {
  let fixed = '';
  for (let i = 0; i < query.length; i += 1) {
    if (query[i + 1] === '[' || query[i - 1] === ']') {
      fixed += "'";
    } else {
      fixed += query[i];
    }
  }
  return fixed;
};

export { logger, fixBracketsJSON };
