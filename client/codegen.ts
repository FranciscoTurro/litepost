import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://litepost-server-production.up.railway.app/graphql',
  documents: './src/graphql/**/*.graphql',
  generates: {
    'src/generated/generated-types.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
    },
  },
};

export default config;
