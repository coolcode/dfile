# DFile: A fancy IPFS-based file sharing mode

This is a no-bullshit and IPFS-based file hosting that also runs on [https://dfile.app](https://dfile.app)

# DFile backend (server)

## Initialize DB

Before running the service for the first time, run

```bash
cp config.sample config.py
```

Modify config.py

## Run

```bash
./dfile.py debug
```

# DFile frontend (app)

Install yarn first: https://yarnpkg.com/lang/en/docs/install/

```bash
# run
yarn
yarn dev

# export to production
yarn export
```
