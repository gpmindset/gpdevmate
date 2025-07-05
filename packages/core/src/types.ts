export interface PlannerConfig {
    maxFiles: number;
    maxFileSizeBytes: number;
    skipDirs: Set<string>;
}

export interface AgentOptions {
    path: string;
    mode: 'openai' | 'local' | 'api';
    maxFiles: number;
    dryRun?: boolean;
    skipDirs: Set<string>;
    maxFileSizeBytes: number;
}
