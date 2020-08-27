

const $http = async (url,config)=>{
    config.timeout?config.timeout:config.timeout=500

    let http = fetch(url, { 
        ...config ,
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body:JSON.stringify(config.data)
    });

    let breaker = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Request timeout: [' + config.timeout + 's].'))
        }, config.timeout);
    });

    return  Promise.race([http, breaker]);
}