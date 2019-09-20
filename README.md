# DFile: A fancy IPFS-based file sharing mode

This is a no-bullshit and IPFS-based file hosting that also runs on [https://dfile.app](https://dfile.app)

![img](https://github.com/coolcode/dfile/blob/master/share/img/dfile.png?raw=true)

## DFile backend (server)

Before running the service for the first time, run

```bash
cp config.sample config.py
```

Modify config.py (mainly setup your [IPFS Node](https://docs.ipfs.io/introduction/usage/))

```bash
IPFS_CONNECT_URL = "/ip4/127.0.0.1/tcp/5001/http"
IPFS_FILE_URL = "http://127.0.0.1:8080/ipfs/"
DOMAIN = "http://localhost:5000"
```

Run it

```bash
./dfile.py debug
```

## DFile frontend (app)

Install yarn first: https://yarnpkg.com/lang/en/docs/install/

```bash
# run
yarn
yarn dev

# export to production
yarn export
```
