help:
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m  %-15s\033[0m %s\n", $$1, $$2}'

front-start: ## Start front
	cd front && npm start

front-deploy: ## Deploy front
	(cd front && npm run deploy)

back-start: ## Start back
	cd back/src && python3 local_server.py

back-deploy: ## Deploy back
	(cd back && terraform apply -auto-approve)