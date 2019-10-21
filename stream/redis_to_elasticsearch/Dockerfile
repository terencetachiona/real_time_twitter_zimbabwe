FROM python:3.7-alpine
WORKDIR /app
COPY . /app
RUN pip install --trusted-host pypi.python.org -r requirements.txt
CMD ["python", "-u", "redis_to_elasticsearch.py"]