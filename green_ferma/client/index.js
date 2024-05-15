const fs = require ('fs');
const http = require('http')

const port = 5000

const replaceTemplate = (temp,product)=>{
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%VITAMIN%}/g, product.vitamin);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')

    return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

const server = http.createServer ((req, res)=> {
    const pathName = req.url;

    if(pathName === '/' || pathName === '/overview'){
        res.writeHead(200,{'Content-type':'text/html'})

        const cardHtml = dataObj.map(el => replaceTemplate(tempCard,el))
        const output = tempOverview.replace('{%PRODUCT_CARD%}', cardHtml)
        res.end (output)
    } else if (pathName === '/product'){
        res.end ('product')
    } else if (pathName === '/api'){
        res.writeHead(200,{'Content-type':'application/json'})
        res.end(data)
    }
    else{
        res.end('<h1><b>page not FOUND</b></h1>')
    }
})

server.listen (port, '127.0.0.1',()=>{
    console.log (`Server start http://localhost:${port}`)
})