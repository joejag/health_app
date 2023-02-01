start:
	(cd front && npm start) &
	(cd back/src && python3 local_server.py)
	fg

start-front:
	cd front && npm start

start-back:
	cd back/src && python3 local_server.py

deploy:
	(cd front && npm run deploy)

back-deploy:
	(cd back && terraform apply -auto-approve)