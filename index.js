import express from "express";
import compression from 'compression';
import fetch from 'node-fetch';
import rateLimit from 'express-rate-limit'

const app = express();
const port = process.env.PORT || "8000";

const apiRequestLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 2, // limit each IP to 2 requests per windowMs
    message: "Your limit exceeded"
})

app.use(compression());
app.use(apiRequestLimiter)

const Middleware = function (req, res, next) {
    // enter your ip to whitelist array
    const whitelist = ['::1'];
    if (whitelist.includes(req.ip)){
        next()
    } else {
        res.status(405).send({error: 'Something went wrong...'})
    }
}

app.get(`/api/getPriceHistory/:startDate/:endDate`, Middleware, async (req, res) => {
    try {
        const response = await fetch(`https://api.coindesk.com/v1/bpi/historical/close.json?start=${req.params.startDate}&end=${req.params.endDate}`);
        const body = await response.json();
        let multiply = [];
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        })
        Object.values(body.bpi).forEach(val =>
            multiply.push(formatter.format(val * 1000))
        );
        res.status(200).send(multiply);
    } catch (e) {
        res.status(500).send({error: 'Something went wrong...'})
    }
});


app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
