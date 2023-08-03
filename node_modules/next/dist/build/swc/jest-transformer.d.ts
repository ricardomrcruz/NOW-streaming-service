import type { NextConfig, ExperimentalConfig } from '../../server/config-shared';
export interface JestTransformerConfig {
    jsConfig: any;
    resolvedBaseUrl?: string;
    pagesDir?: string;
    hasServerComponents?: boolean;
    isEsmProject: boolean;
    modularizeImports?: NextConfig['modularizeImports'];
    swcPlugins: ExperimentalConfig['swcPlugins'];
    compilerOptions: NextConfig['compiler'];
}
