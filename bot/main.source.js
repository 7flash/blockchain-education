const EthCrypto = require("eth-crypto");

const identity = EthCrypto.createIdentity();

window.onload = function() {
    document.getElementById('priv').innerHTML = identity.privateKey;
};