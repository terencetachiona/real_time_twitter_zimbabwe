FROM python:3.7-alpine
WORKDIR /app
COPY . /app
RUN pip install --trusted-host pypi.python.org -r requirements.txt
CMD ["python", "-u", "twitter_to_redis.py"]