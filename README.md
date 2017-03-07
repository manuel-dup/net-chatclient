# Simple chat client

### Run the project
After cloning the repository, go in your local working copy, then
```sh
# Build
mvn clean install

# Run Docker image
docker run --rm --name netproject-chatclient -p 8580:80 registry.eptica.com/eptica/numegtour-chatclient
```
And check http://localhost:8580/ (or http://localhost:8580/chatclient)


### Develop in the project

Run the Docker image with the following command:
```sh
# in 'chatclient' project
docker run --name netproject-chatclient --rm -p 8580:80 -v ${PWD}/src/main/resources/www:/var/www:ro registry.eptica.com/eptica/numegtour-chatclient
# nginx will serve the sources instead of what is inside the Docker container
```