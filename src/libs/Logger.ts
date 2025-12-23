/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:34
 * Last Updated: 2025-12-23T09:43:51
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import logtail from '@logtail/pino';
import type { DestinationStream } from 'pino';
import pino from 'pino';
import pretty from 'pino-pretty';

import { Env } from './Env';

let loggerInstance: pino.Logger | undefined;

async function initializeLogger() {
  let stream: DestinationStream;
  if (Env.LOGTAIL_SOURCE_TOKEN) {
    stream = pino.multistream([
      await logtail({
        sourceToken: Env.LOGTAIL_SOURCE_TOKEN,
        options: {
          sendLogsToBetterStack: true,
        },
      }),
      {
        stream: pretty(), // Prints logs to the console
      },
    ]);
  } else {
    stream = pretty({
      colorize: true,
    });
  }
  loggerInstance = pino({ base: undefined }, stream);
}

(async () => {
  await initializeLogger();
})();

export const logger = loggerInstance!;
