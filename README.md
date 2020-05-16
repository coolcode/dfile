# DFile: A fancy S3-based file sharing mode

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3b25d03f9535456997878815286921eb)](https://www.codacy.com/manual/coolcode/dfile?utm_source=github.com&utm_medium=referral&utm_content=coolcode/dfile&utm_campaign=Badge_Grade)

This is a no-bullshit and S3-based file hosting that also runs on [https://dfile.app](https://dfile.app)

![img](https://github.com/coolcode/dfile/blob/master/share/img/dfile.png?raw=true)

## DFile backend (api)

Before running the service for the first time, run

```bash
cp config.sample config.py
```

Modify config.py (mainly setup your [S3](https://aws.amazon.com/s3/))

```bash
DOMAIN = "http://localhost:5000"
S3_REGION = "<s3 region>"
S3_ENDPOINT = "https://s3-domain.com"
S3_KEY = "<your s3 key>"
S3_SECRET = "<your s3 secret>"
```

Run it

```bash
python3 -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt
export FLASK_APP=app
export FLASK_ENV=development
export FLASK_DEBUG=1
flask run --host 0.0.0.0 --port 5000
```

## DFile frontend (app)

Install yarn first: [https://yarnpkg.com/lang/en/docs/install/](https://yarnpkg.com/lang/en/docs/install/)

```bash
# run
cd app
yarn
yarn dev

# export to production
yarn export
```

## How to use

```bash
# Upload using cURL
➜ curl -F file=@yourfile.txt https://dfile.herokuapp.com
https://dfile.herokuapp.com/QmV...HZ
# Download the file
➜ curl -L https://dfile.herokuapp.com/QmV...HZ -o yourfile.txt
```
