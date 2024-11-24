FROM node:18

RUN apt-get update && apt-get -y upgrade
WORKDIR /home
RUN mkdir frontend
RUN yarn create vite frontend --template react
WORKDIR frontend
RUN npm install axios react-router-dom jwt-decode
RUN npm install react-router-dom@6
RUN npm install react-toastify
RUN npm install @react-oauth/google
RUN npm install @fortawesome/free-solid-svg-icons
RUN npm install @fortawesome/react-fontawesome
RUN npm install react-use-websocket
RUN npm install lucide-react

RUN npm install



EXPOSE 5173