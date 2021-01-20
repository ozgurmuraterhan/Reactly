const https = require('https');

https.get('https://coderbyte.com/api/challenges/json/age-counting', (response) => {

    let str = '';

    response.on('data', function (chunk) {
        str += chunk;
    });

    response.on('end', function () {
        str = JSON.parse(str);
        str = str.data.split(",")

        for (let i = 0; i < str.length; i++) {
            if (str[i].search("key=", "")) {
                console.log(str[i].replace("key=", ""))
            }

        }



    });



    // parse json data here...

    //console.log(response);

});