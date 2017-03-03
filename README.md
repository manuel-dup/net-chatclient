# Simple chat client

### Run the project
After cloning the repository, go in your local working copy, then
```sh
docker run --rm --name netproject -v ${PWD}/app:/usr/share/nginx/html/chat:ro -p 8580:80 nginx
```
And check http://localhost:8580/chat/

### Next step

1. Move it to a Maven project
2. Ship the app into a Docker image