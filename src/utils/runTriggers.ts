import fs from "fs";
import glob from "glob";
import { promisify } from "util";

import database from "../database";
import logger from "@utils/logger";

const readFile = promisify(fs.readFile);

export default () => {
  glob(`${__dirname}/../../queries/triggers/*.sql`, {}, async (err, files) => {
    if (err) {
      logger.log("error", "error while finding triggers", { err });
      return;
    }
    logger.log("debug", "triggers found", { files });

    for (const fileName of files) {
      try {
        const fileContent = await readFile(fileName, "utf8");
        await database.query(fileContent);
      } catch (err) {
        logger.log("error", "error while reading/adding trigger to DB", {
          err,
          fileName
        });
      }
    }
  });
};
