# Sentry integration

Sentry is consumed as a managed service instead of running the large self-hosted stack in local Compose.

1. Create projects for Web Admin, Patient App, Doctor App, Backend and Service.
2. Put each DSN in the application's secret environment configuration.
3. Configure repository secrets `SENTRY_AUTH_TOKEN`, `SENTRY_ORG` and `SENTRY_PROJECT`.
4. The root GitHub Actions workflow creates a Sentry release when those secrets exist.

Never commit a Sentry auth token. DSNs may be supplied through runtime environment variables.
