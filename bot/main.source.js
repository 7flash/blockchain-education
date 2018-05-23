const EthCrypto = require("eth-crypto");

function generateIdentity() {
    const identity = EthCrypto.createIdentity();

    return identity;
}

window.onload = function() {
    if(document.getElementById('privateKeyResult')) {
        const identity = generateIdentity();

        document.getElementById('privateKeyResult').innerHTML = identity.privateKey;
        document.getElementById('publicKeyResult').innerHTML = identity.publicKey;
    }

    if(document.getElementById('share')) {
        document.getElementById('share').addEventListener('click', async function () {
            const course = document.getElementById('course').value;

            const link = document.getElementById('rawLink').value;

            const privateKey = document.getElementById('privateKey').value;

            const studentPublicKey = document.getElementById('publicKey').value;

            const address = EthCrypto.publicKey.toAddress(studentPublicKey);

            const encryptedLink = await EthCrypto.encryptWithPublicKey(studentPublicKey, link);

            const encryptedLinkString = EthCrypto.cipher.stringify(encryptedLink);

            const signHash = EthCrypto.hash.keccak256([
                {
                    type: 'address',
                    value: address
                },
                {
                    type: 'string',
                    value: encryptedLinkString
                }
            ]);

            const signature = EthCrypto.sign(privateKey, signHash);

            const result = '/share '.concat(JSON.stringify({
                course: course,
                address: address,
                link: encryptedLinkString,
                signature: signature
            }));

            document.getElementById('result').innerHTML = result;
        });
    }

    if(document.getElementById('publish')) {
        document.getElementById('publish').addEventListener('click', function () {
            const name = document.getElementById('name').value;
            const privateKey = document.getElementById('privateKey').value;

            const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey);

            const authorAddress = EthCrypto.publicKey.toAddress(publicKey);

            const signHash = EthCrypto.hash.keccak256([
                {
                    type: 'string',
                    value: name
                },
                {
                    type: 'address',
                    value: authorAddress
                }
            ]);

            const signature = EthCrypto.sign(privateKey, signHash);

            const result = '/publish '.concat(JSON.stringify({
                name: name,
                address: authorAddress,
                signature: signature
            }));

            document.getElementById('result').innerHTML = result;
        });
    }

    if(document.getElementById('access')) {
        document.getElementById('access').addEventListener('click', async function() {
            const privateKey = document.getElementById('privateKey').value;

            const encryptedLink = document.getElementById('encryptedLink').value;

            const result = await EthCrypto.decryptWithPrivateKey(privateKey, encryptedLink);

            document.getElementById('result').innerHTML = result;
        });
    }
};