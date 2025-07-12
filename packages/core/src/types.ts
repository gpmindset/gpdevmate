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

export interface PRAgentOptions {
    snippets: PRFiles[],
    maxFiles: number;
}

export interface PRReview {
    path: string
    line: number
    comment: string
}

export interface PRFiles {
    path: string;
    content: string;
    patch: string | undefined;
}
