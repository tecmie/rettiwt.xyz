//  The objective of this listener is to receive a message from the queue and
// ddecide which listener to publish to based on the actions of the message.

// thats all for now
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { SerpAPI } from 'langchain/tools';
import { Calculator } from 'langchain/tools/calculator';

const tools = [new Calculator(), new SerpAPI()];
const chat = new ChatOpenAI({ modelName: 'gpt-4', temperature: 0 });

const executor = await initializeAgentExecutorWithOptions(tools, chat, {
  agentType: 'openai-functions',
  verbose: true,
});

const result = await executor.run('What is the weather in New York?');
console.log(result);
