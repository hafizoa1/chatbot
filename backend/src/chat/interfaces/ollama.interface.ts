
export interface OllamaRequestOptions {
    model: string;
    prompt: string;
    stream?: boolean;
    context?: number[];
    temperature?: number;
    top_p?: number;
    top_k?: number;
    repeat_penalty?: number;
    seed?: number;
  }
  
  export interface OllamaResponse {
    model: string;
    response: string;
    done: boolean;
    context?: number[];
    total_duration?: number;
    load_duration?: number;
    prompt_eval_duration?: number;
    eval_duration?: number;
    prompt_tokens?: number[];
    eval_tokens?: number[];
  }