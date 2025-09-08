import { env } from "./env";


import arcjet, {
detectBot,
fixedWindow,
protectSignup,
sensitiveInfo,
shield,
slidingWindow
} from '@arcjet/next'

export {
    detectBot,
    fixedWindow,
    protectSignup,
    sensitiveInfo,
    shield,
    slidingWindow,
};

export default arcjet({
    key: env.ARCJET_KEY,

    characteristics: ["fingerprint"],

    //define base rules here, can also be empty if you don't want to have any
    rules: [
        shield({
            mode: 'LIVE',
        })
    ]
})