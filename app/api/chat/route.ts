import _ from 'lodash';
import { env } from '@/env.mjs';
import { type NextRequest } from 'next/server';
import { connect, MetricType, OpenAIEmbeddingFunction } from 'vectordb';
import { StreamingTextResponse } from 'ai';
import { prompt } from './prompt';

import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BytesOutputParser } from 'langchain/schema/output_parser';

/**
 * @warning
 * We can't use the Edge runtime due to Vector DB limitations
 * */
// export const runtime = 'edge'
const _VECTOR_SOURCE_COLUMN_ = 'text';
const _GPT3_MODEL_ = 'gpt-3.5-turbo-0613';
const _GPT4_MODEL_ = 'gpt-4-0613';
const embeddings = new OpenAIEmbeddingFunction(_VECTOR_SOURCE_COLUMN_, env.OAK);

/*
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  const messages = body.messages ?? [];
  const currentMessageContent = messages[messages.length - 1].content;

  /**
   * Vector Retrieval step for our actor
   * We read the actor information from request cookie
   * And use it to perform a similarity search on LanceDB
   **/
  const db = await connect('vectors');
  const actor = req.cookies.get('persona');

  const table = await db.openTable(actor?.value ?? '0x', embeddings);

  console.log(table);

  /**
   * We need to filter out the messages that are not tweets
   * or quote tweets when executing our queries
   *
   * @see https://lancedb.github.io/lancedb/sql/
   */
  const results = await table
    .search(currentMessageContent as string)
    .metricType(MetricType.Cosine)
    .where(`type IN ("tweet", "thread-tweet", "quote-tweet")`)
    .select(['type', 'text', 'url'])
    .limit(3)
    .execute();

  // need to make sure our prompt is not larger than max size
  const formattedContext = results
    .map((r) => r.text)
    .join('\n\n---\n\n')
    .substring(0, 3750);

  /**
   * Create some sort of variability in model use,
   * with more bias towards GPT4
   */
  const openaiModel = _.sample([
    _GPT3_MODEL_,
    // _GPT4_MODEL_,
    // _GPT4_MODEL_,
    // _GPT4_MODEL_,
    // _GPT4_MODEL_,
  ]);

  /**
   * See a full list of supported models at:
   * https://js.langchain.com/docs/modules/model_io/models/
   */
  const model = new ChatOpenAI({
    temperature: 0.7,
    modelName: openaiModel,
    openAIApiKey: env.OAK,
    verbose: true,
  });

  /**
   * Chat models stream message chunks rather than bytes, so this
   * output parser handles serialization and encoding.
   */
  const outputParser = new BytesOutputParser();

  /*
   * Can also initialize as:
   *
   * import { RunnableSequence } from "langchain/schema/runnable";
   * const chain = RunnableSequence.from([prompt, model, outputParser]);
   */
  const chain = prompt.pipe(model).pipe(outputParser);

  const stream = await chain.stream({
    actor: actor?.value,
    context: formattedContext,
    input: currentMessageContent,
  });

  return new StreamingTextResponse(stream);
}
