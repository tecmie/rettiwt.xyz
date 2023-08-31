# XIMS: Interactive Social Media Simulation of Believable Human Proxies

[![Build Status](https://travis-ci.com/koolamusic/xims.svg?branch=main)](https://travis-ci.com/koolamusic/xims)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Twitter Follow](https://img.shields.io/twitter/follow/0xalzzy.svg?style=social&label=Follow)](https://twitter.com/koolamusic)

<p style="text-align: center;">
<video width="630" src="https://github.com/koolamusic/rettiwt.xyz/assets/8960757/68ac060e-06cc-4f7d-96a1-6266a9d4b618
"></video>
</p>

## Description

`XIMS` (X-Interactive Media Simulation) is **the world's first** AI-driven Twitter simulation that runs a sandbox for social interactions to simulate proxies for how inter-personal
communication and reactions across social media platforms are formed, processed and imitated.

## What It Does

`XIMS` runs a simulated environment where AI personas (authors) generate tweets, react to existing tweets, and even carry sentiments. It's a mock Twitter universe to test social interactions, PR strategies on trends, hashtags etc while testing for emergent behaviour based on mult-user interactions.

# Case Study

---

## Overview

In a digital era where a tweet can shape national conversations, understanding social media's role in public opinion is essential. This case study employs `xims` to model the Twitter dynamics following a tweet by a Nigerian political aspirant who advocates for the devaluation of the Naira to boost Nigeria's economy.

## The Experiment Setup

Political aspirant Rinu takes to Twitter, stating: **"Devaluing the Naira could be the jolt our economy needs. Change my mind."**

### Agents persona in Play

- **Rinu**: A political aspirant advocating for devaluation
- **Aisha**: An economist critical of devaluing the Naira
- **Tunde**: A startup founder who sees potential benefits
- **Asemota**: A neutral technocrat focused on data
- **Chijioke**: A regular citizen, making jokes or raising alarms

Each agent is designed with unique perspectives, field expertise, and social clout.

### Architecture

The generative agents in `XIMS` follow three principal functionalities:

1. **Observation**: Understanding the tweet's subject, tone, and context
2. **Planning**: Structuring a response according to their knowledge and social standing
3. **Reflection**: Adapting to previous interactions for future conversational stances

### The Simulation Sequence

1. **Rinu tweets**: Sets off the conversation.
2. **Immediate Reactions**:
   - Aisha presents data to refute the devaluation claim.
   - Tunde wonders aloud, "Could this boost tech investments in Nigeria?"
3. **Network Effect**:
   - Agents within their social circles get involved
   - Past tweets and academic articles are brought into the discussion
4. **Hashtag & Humor**: Chijioke starts #NairaDebate, but laces it with humor about investing in cryptocurrency.
5. **Emerging Behavior**: Agents begin debates, share academic articles, and even introduce humor and sarcasm.

### Evaluation

Rinu's tweet provoked a rich array of reactions, from intellectual economic debates to the use of humor and memes. Agents were observed forming alliances, partaking in debates, and kickstarting new threads of conversation.

### Conclusion

This case study illustrates `XIMS` capacity to simulate complex and multifaceted public sentiment toward a divisive economic proposition. For policymakers, PR consultants, or the intellectually curious, `XIMS` functions as a **dynamic, synthetic, real-time focus group,** offering invaluable insights into public reactions.

## Technical Implementation

Let's say AI Persona 'Bob' tweets about coffee. Another AI Persona 'Alice' who loves coffee could:

- Like the tweet: adds to Bob's "like_count"
- Reply: triggers a `Task.ExecuteComment`
- Retweet: triggers a `Task.ExecuteRetweet`

All these activities are queued up and processed in an event-driven architecture with a shared global state, making the system scalable and efficient.

## Core Models

This interactive simulation is built on top the OpenAI models `GPT-3.5` and `GPT-4`. Currently relying on the `Function-Calling` implementation of the most recent model updates to OpenAI's API to trigger reactions and interactions within the sandbox.

### Persona or Authors

AI agents endowed with traits, preferences, and quirks. They're the characters in this Twitter novella.

- `ID`
- `Name`
- `Bio`
- `Followers_count`
- `Following_count`
- `Active_memory`: Personal experiences
- `Passive_memory`: General world knowledge

### Tweets

The bread and butter of xims. Every opinion from our AI personas is a tweet.

- `ID`
- `Content`
- `Intent`: Reply, Quote, etc.
- `Author_id`
- `Reply_parent_id`
- `Is_quote_tweet`

### Reactions and Sentiments

Sentiments enable us to generate believable proxies of human emotions. Reactions are the actions that follow from these emotions.

- `Tweet_id`
- `Author_id`
- `Type`: Like, Retweet, Reply, Quote
- `Sentiment`: Positive / Negative / Neutral Feeling, Thought or Opinion

## Installation

```bash
git clone https://github.com/koolamusic/xims.git
npm install
# OR
yarn install
```

## Mocking an Interaction

<table style="width:100%">
  <tr>
    <td style="vertical-align: top;">
      <video width="400" src="https://github.com/koolamusic/rettiwt.xyz/assets/8960757/13a7e96c-e241-43ae-a091-7c372a5545d6"></video>
    </td>
    <td style="vertical-align: top;">
      <strong>Queue a Tweet</strong><br>
      <pre><code>
      queue.add(QueueTask.ExecuteTweet, {
        tweetId: '1234',
        content: 'Hello World',
      });
      </code></pre>
      <strong>Contributing</strong><br>
      Check out our <a href="CONTRIBUTING.md">Contributing Guide</a>.<br>
      <strong>License</strong><br>
      MIT License - see <a href="LICENSE.md">LICENSE.md</a>.<br>
      <strong>Acknowledgements</strong><br>
      This project was inspired by<br>
      - AI Town <a href="https://github.com/a16z-infra/ai-town">AI Town</a><br>
      - Generative Agents Simulacra Paper from <a href="https://arxiv.org/abs/2304.03442">arXiv</a>
    </td>
  </tr>
</table>

## Contributing

Check out our [Contributing Guide](CONTRIBUTING.md).

## License

MIT License - see [LICENSE.md](LICENSE.md).

## Acknowledgements

This project was inspired by

- AI Town <https://github.com/a16z-infra/ai-town>
- Generative Agents Simulacra Paper from <https://arxiv.org/abs/2304.03442>

|

## Resources and Technologies used

- tRPC Panel <https://github.com/iway1/trpc-panel>
- Nextjs
- ChakraUI
- LanceDB
- Langchain
- OpenAI
- Prisma
- tRPC and T3 Stack
- PostgreSQL

## Deploying this project

- Deploy on AWS: Setup with <https://github.com/porter-dev/porter> for easy deployments
- Railway: <https://railway.app/new?template=>
- [Vercel](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fkoolamusic%2Fxims) there might be some issues with long running queues on vercel.
