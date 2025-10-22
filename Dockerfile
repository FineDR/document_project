# step 1 : build the react app
FROM node:20-alpine AS build
# set the working dir
WORKDIR /app

# copying the package files and installing 
COPY package.json package-lock.json ./
RUN npm install

# copying all files and build 

COPY . .
RUN npm run build

#telling that you using the nginx

FROM nginx:alpine

#removing the default website

RUN rm -rf /usr/share/nginx/html/*
#copying from build/dist to the /usr/share/html/
COPY --from=build /app/dist /usr/share/nginx/html
#expose 80
EXPOSE 80

#to start nginx
CMD [ "nginx","-g","daemon off;" ]