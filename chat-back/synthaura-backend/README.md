Kubernetes Secrets: Create secrets for your production environment:

bash
Copy
kubectl create secret generic ai-voice-secrets \
  --from-literal=OPENAI_API_KEY=your_key \
  --from-literal=DEEPSEEK_API_KEY=your_key \
  --from-literal=SECRET_KEY=your_secret_key \
  --from-literal=DATABASE_URL=your_prod_db_url
CI/CD Pipeline: Example GitHub Actions workflow (.github/workflows/deploy.yml):

yaml
Copy
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: docker/setup-buildx-action@v1
      - uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_TOKEN }}
      - run: docker build -t your-registry/ai-voice-backend:latest .
      - run: docker push your-registry/ai-voice-backend:latest
      - uses: azure/k8s-deploy@v1
        with:
          namespace: production
          manifests: k8s/deployment.yaml
          images: your-registry/ai-voice-backend:latest




