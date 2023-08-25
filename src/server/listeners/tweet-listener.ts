import queue, { QueueTask } from '@/utils/queue';

queue.on(QueueTask.TWEET, (...[message, payload]) =>
  console.log({ message, payload }),
);
queue.on(QueueTask.TWEET, (...message) =>
  console.log(message[0], 'i am just another listener'),
);
