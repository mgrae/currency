# Optional tasks options


Optional task - api request limiter:

```
const apiRequestLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 2, // limit each IP to 2 requests per windowMs, change it to increase or decrease limit
    message: "Your limit exceeded"
})
```

Option task whitelist middleware:

```
const Middleware = function (req, res, next) {
    const whitelist = ['::1'];  // add your ip to this array
    if (whitelist.includes(req.ip)){
        next()
    } else {
        res.status(405).send({error: 'Something went wrong...'})
    }
}
```
