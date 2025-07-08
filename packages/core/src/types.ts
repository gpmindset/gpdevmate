export interface PlannerConfig {
    maxFiles: number;
    maxFileSizeBytes: number;
    skipDirs: Set<string>;
}

export interface AgentOptions {
    path: string;
    provider: 'openai' | 'ollama' | 'hf';
    maxFiles: number;
    skipDirs: Set<string>;
    maxFileSizeBytes: number;
}
