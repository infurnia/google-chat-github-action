const core = require('@actions/core');
const axios = require('axios'); 

function randomString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const main = async () => {
    try {
        const message = core.getInput('message');
        const webhookUrl = core.getInput('gchat_webhook_url');
        let threadKey = core.getInput('thread_key');

        if(threadKey == 'None') {
            threadKey = randomString(10);
        }
        console.log("[*] threadKey: ", threadKey);

        let messageFragments = message.split("\n");
        let i = 0;
        while(i < messageFragments.length) {
            let sentSize = 0;
            let currentWindow = "";
            while(sentSize < 4096 && i < messageFragments.length){
                sentSize += messageFragments[i].length + 1;
                if(sentSize < 4096){
                    currentWindow = currentWindow + messageFragments[i] + "\n";
                    i = i + 1
                }
            }
            await axios.post(webhookUrl + "&threadKey=" + threadKey, {"text": currentWindow})
        }
    } catch (error) {
        core.setFailed(error.message);
        process.exit(1);
    }
}

main();
