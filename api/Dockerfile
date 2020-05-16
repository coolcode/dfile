FROM python:3.6.7

RUN mkdir -p /server
WORKDIR /server
COPY requirements.txt /server
RUN pip install --no-cache-dir -r requirements.txt

COPY . /server