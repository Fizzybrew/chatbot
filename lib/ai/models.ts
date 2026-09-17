export const DEFAULT_CHAT_MODEL = "moonshotai/kimi-k2.5";

export type ReasoningEffort = "none" | "minimal" | "low" | "medium" | "high";

export type ModelCapabilities = {
  tools: boolean;
  vision: boolean;
  reasoning: boolean;
};

export type ChatModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
  reasoningEffort?: ReasoningEffort;
};

export const titleModel: ChatModel = {
  description: "Fast model for title generation",
  id: DEFAULT_CHAT_MODEL,
  name: "Kimi K2.5",
  provider: "moonshotai",
};

export const chatModels: ChatModel[] = [
  {
    description: "Fast and capable model with tool use",
    id: "deepseek/deepseek-v3.2",
    name: "DeepSeek V3.2",
    provider: "deepseek",
  },
  {
    description: "Moonshot AI flagship model",
    id: "moonshotai/kimi-k2.5",
    name: "Kimi K2.5",
    provider: "moonshotai",
  },
  {
    description: "Compact reasoning model",
    id: "openai/gpt-oss-20b",
    name: "GPT OSS 20B",
    provider: "openai",
    reasoningEffort: "low",
  },
  {
    description: "Open-source 120B parameter model",
    id: "openai/gpt-oss-120b",
    name: "GPT OSS 120B",
    provider: "openai",
    reasoningEffort: "low",
  },
];

type RouterAIPricingUnit =
  | "token"
  | "request"
  | "image"
  | "megapixel"
  | "second"
  | "search_unit";

type RouterAIArchitecture = {
  modality?: string;
  input_modalities?: string[];
  output_modalities?: string[];
  tokenizer?: string;
};

type RouterAIImagePricing = {
  unit: "image" | "megapixel" | "token";
  variant: string | null;
  price: number;
};

type RouterAIModel = {
  id: string;
  name: string;
  created: number;
  description: string;
  context_length: number;
  architecture: RouterAIArchitecture;
  pricing: Record<string, number>;
  pricing_units: Record<string, RouterAIPricingUnit>;
  supported_parameters: string[];
  default_parameters: Record<string, unknown>;
  image_pricing?: RouterAIImagePricing[];
  per_request_limits?: Record<string, unknown>;
};

type RouterAIModelsResponse = {
  data: RouterAIModel[];
};

type RouterAIEndpoint = {
  name: string;
  provider_name: string;
  tag: string;
  country: string | null;
  context_length: number | null;
  quantization?: string;
  max_completion_tokens: number | null;
  max_prompt_tokens?: number;
  supported_parameters: string[] | null;
  supported_apis: string[];
  status: number;
  pricing: Record<string, number>;
  pricing_units: Record<string, RouterAIPricingUnit>;
  variable_pricings: Record<string, unknown>[];
};

type RouterAIModelEndpoints = {
  id: string;
  name: string;
  created: number;
  description: string;
  architecture: RouterAIArchitecture;
  endpoints: RouterAIEndpoint[];
};

type RouterAIModelEndpointsResponse = {
  data: RouterAIModelEndpoints;
};

function getRouterAIModelEndpointsUrl(modelId: string): string {
  const [author, slug] = modelId.split("/");

  if (!author || !slug) {
    throw new Error(`Invalid model ID: ${modelId}`);
  }

  return `https://routerai.ru/api/v1/models/${author}/${slug}/endpoints`;
}

export async function getCapabilities(): Promise<
  Record<string, ModelCapabilities>
> {
  const results = await Promise.all(
    chatModels.map(async (model): Promise<[string, ModelCapabilities]> => {
      try {
        const res = await fetch(getRouterAIModelEndpointsUrl(model.id), {
          next: { revalidate: 86_400 },
        });

        if (!res.ok) {
          return [
            model.id,
            {
              reasoning: false,
              tools: false,
              vision: false,
            },
          ];
        }

        const json = (await res.json()) as RouterAIModelEndpointsResponse;

        const { endpoints } = json.data;

        const params = new Set(
          endpoints.flatMap((endpoint) => endpoint.supported_parameters ?? [])
        );

        const inputModalities = new Set(
          json.data.architecture.input_modalities ?? []
        );

        return [
          model.id,
          {
            reasoning:
              params.has("reasoning") || params.has("reasoning_effort"),
            tools: params.has("tools"),
            vision: inputModalities.has("image"),
          },
        ];
      } catch {
        return [
          model.id,
          {
            reasoning: false,
            tools: false,
            vision: false,
          },
        ];
      }
    })
  );

  return Object.fromEntries(results);
}

export const isDemo = process.env.IS_DEMO === "1";

export type RouterAIModelWithCapabilities = ChatModel & {
  capabilities: ModelCapabilities;
};

export async function getAllRouterAIModels(): Promise<
  RouterAIModelWithCapabilities[]
> {
  try {
    const res = await fetch("https://routerai.ru/api/v1/models", {
      next: { revalidate: 86_400 },
    });

    if (!res.ok) {
      return [];
    }

    const json = (await res.json()) as RouterAIModelsResponse;

    return json.data
      .filter((model) => model.architecture.output_modalities?.includes("text"))
      .map(
        (model): RouterAIModelWithCapabilities => ({
          capabilities: {
            reasoning:
              model.supported_parameters.includes("reasoning") ||
              model.supported_parameters.includes("reasoning_effort"),
            tools: model.supported_parameters.includes("tools"),
            vision:
              model.architecture.input_modalities?.includes("image") ?? false,
          },
          description: model.description,
          id: model.id,
          name: model.name,
          provider: model.id.split("/")[0],
        })
      );
  } catch {
    return [];
  }
}

export function getActiveModels(): ChatModel[] {
  return chatModels;
}

export const allowedModelIds = new Set(chatModels.map((model) => model.id));

export const modelsByProvider = chatModels.reduce<Record<string, ChatModel[]>>(
  (acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }

    acc[model.provider].push(model);

    return acc;
  },
  {}
);

export type ModelAvailability = "healthy" | "impacted" | "unknown";

function isEndpointImpacted(endpoint: RouterAIEndpoint): boolean {
  return endpoint.status < 0;
}

export async function getModelAvailability(
  modelId: string
): Promise<ModelAvailability> {
  const model = chatModels.find((item) => item.id === modelId);

  if (!model) {
    return "unknown";
  }

  try {
    const res = await fetch(getRouterAIModelEndpointsUrl(model.id), {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return "unknown";
    }

    const json = (await res.json()) as RouterAIModelEndpointsResponse;

    const { endpoints } = json.data;

    if (endpoints.length === 0) {
      return "unknown";
    }

    return endpoints.some(isEndpointImpacted) ? "impacted" : "healthy";
  } catch {
    return "unknown";
  }
}
