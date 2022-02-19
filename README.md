# Getting start

## Clone Project

```jsx
git clone https://github.com/MINJE-98/Podo
```

## install Truffle

```jsx
sudo npm install -g truffle
truffle version
```

## install Ganache-cli

```jsx
sudo npm install -g ganache-cli
ganache-cli version
```

### Modify truffle.json

```jsx
networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    }
}
```

## Deploy

### Ganache-cli

```jsx
turffle development
truffle migrate
```

### Ethereum

use [REMIX](https://remix.ethereum.org/)

## Test

```jsx
truffle test
```
