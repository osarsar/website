FROM ubuntu:latest

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y tzdata
RUN apt-get -y install python3-pip
RUN apt-get -y install python3-venv
WORKDIR /home
RUN python3 -m venv env
ENV PATH="/home/env/bin:$PATH"
RUN pip install django 
RUN pip install djangorestframework djangorestframework-simplejwt python-dotenv asgiref django-cors-headers PyJWT pytz sqlparse sqlparse psycopg2-binary api bcrypt requests
RUN python -m pip install Pillow
WORKDIR env
RUN django-admin startproject backend
WORKDIR backend
RUN python3 manage.py startapp pages
RUN mkdir -p backend/static
RUN pip install gunicorn
RUN python3 manage.py migrate
RUN pip install django-allauth
RUN pip install cryptography
RUN pip install whitenoise
RUN pip install channels daphne channels_redis

# RUN python3 manage.py collectstatic --noinput
ENV DJANGO_SETTINGS_MODULE=backend.settings
EXPOSE 8000

CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "backend.asgi:application"]

