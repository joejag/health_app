help:
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m  %-15s\033[0m %s\n", $$1, $$2}'

start: ## Start front and back
	(cd front && npm start) &
	(cd back/src && python3 local_server.py)
	fg

start-front: ## Start front
	cd front && npm start

start-back: ## Start back
	cd back/src && python3 local_server.py

deploy-front: ## Deploy front
	(cd front && npm run deploy)

back-deploy: ## Deploy back
	(cd back && terraform apply -auto-approve)