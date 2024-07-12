const slug = require('slugify');

const generateRandomString = () => {
    const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const number = '123456789';

    let result = ''

    for(let i = 0; i < 4; i++){
        result += char.charAt(Math.floor(Math.random() * char.length));
    }

    for(let i = 0; i < 4; i++){
        result += number.charAt(Math.floor(Math.random() * number.length));
    }

    result.split('').sort(() => 0.5 - Math.random()).join('');

    return result;
}

const generateSlug = (text) => {
    const randomString = generateRandomString();
    const productSlug = slug(`${text}-${randomString}`, {lower: true});

    return productSlug;
}


module.exports = generateSlug;