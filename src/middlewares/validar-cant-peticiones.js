import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 15*60*1000, //15 mnts
    max: 100,
    message:{
        succes: false,
        msg: "Intenta más tarde, demasiadas peticiones desde esta IP"
    }
})

export default limiter;

