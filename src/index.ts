const express = require('express')
const app = express()
const port = 3000

app.get('/', (req: any, res: any) => {
    res.send('Hello World!')
})

app.get('/profile', (req: any, res: any) => {
    res.send('Hello Egor!')
})

app.get('/user', (req: any, res: any) => {
    res.send('Hello User!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})