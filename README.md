<a href="https://chatbot.ai-sdk.dev/demo">
  <img alt="Chatbot" src="app/(chat)/opengraph-image.png">
  <h1 align="center">Chatbot</h1>
</a>

<p align="center">
  Chatbot (formerly AI Chatbot) is a free, open-source template built with Next.js and the AI SDK that helps you quickly build powerful chatbot applications.
</p>

<p align="center">
  <a href="https://chatbot.ai-sdk.dev/docs"><strong>Read Docs</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>

<br/>

## Features

- [Next.js](https://nextjs.org) App Router
  - Advanced routing for seamless navigation and performance
  - React Server Components (RSCs) and Server Actions for server-side rendering and increased performance

- [AI SDK](https://ai-sdk.dev/docs/introduction)
  - Unified API for generating text, structured objects, and tool calls with LLMs
  - Hooks for building dynamic chat and generative user interfaces
  - Model access through [RouterAI](https://routerai.ru/) using its OpenAI-compatible API

- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility

- Data Persistence
  - [Neon Serverless Postgres](https://vercel.com/marketplace/neon) for saving chat history and user data
  - [Vercel Blob](https://vercel.com/storage/blob) for efficient file storage

- [Auth.js](https://authjs.dev)
  - Simple and secure authentication

## Model Providers

This template uses [RouterAI](https://routerai.ru/) to access AI models through an OpenAI-compatible API. Models are configured in `lib/ai/models.ts`.

The default model is **Kimi K2.5**. The curated model list currently includes:

- DeepSeek V3.2
- Kimi K2.5
- GPT OSS 20B
- GPT OSS 120B

## RouterAI Authentication

Set your RouterAI API key in `.env.local`:

```env
ROUTER_AI_API_KEY=your_api_key
```

The application sends model requests to the RouterAI OpenAI-compatible API using this key.

With the [AI SDK](https://ai-sdk.dev/docs/introduction), you can also integrate other model providers directly when needed.

## Deploy Your Own

You can deploy your own version of Chatbot to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/templates/next.js/chatbot)

## Running locally

You will need the environment variables [defined in `.env.example`](.env.example) to run Chatbot.

Create a `.env.local` file and provide the required values, including your RouterAI API key.

> Note: You should not commit your `.env` or `.env.local` files because they may contain secrets that provide access to your AI, database, storage, or authentication services.

```bash
pnpm install

pnpm db:migrate # Setup database or apply latest database changes

pnpm dev
```

Your app template should now be running on [localhost:3000](http://localhost:3000).
