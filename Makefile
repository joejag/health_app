start:
	(cd front && npm start) &
	(cd back/src && python3 local_server.py)
	fg
	
deploy:
	(cd front && npm run deploy)

back-deploy:
	(cd back && terraform apply -auto-approve)