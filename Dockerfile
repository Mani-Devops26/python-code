FROM python:3.10.21-alpine3.23

WORKDIR /water

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt && adduser -D devops 

COPY . .

RUN chown -R devops:devops /water

USER devops

EXPOSE 5000

ENTRYPOINT ["python", "app.py"]


