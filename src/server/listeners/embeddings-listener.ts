// This listener receives a directive to persist a new action into our vector database.

// We might rely on the broadcast listener to know how to handle this, or internally handle the switches ourselves.

import queue, { QueueTask } from '@/utils/queue';

queue.on(QueueTask.EMBED_TWEET, (...[message, payload]) =>
  console.log({ message, payload }),
);
queue.on(QueueTask.EMBED_TWEET, (...message) =>
  console.log(message[0], 'i am just another listener'),
);
