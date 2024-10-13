const express = require('express')
const urlRoute = require('./routes/url');
const path = require('path');
const {connectToMongoDB} = require('./connect');
const staticRoute = require('./routes/staticrouter')
const app = express()
const PORT = 8000
const URL = require('./models/url')


connectToMongoDB("mongodb+srv://kumardigvijay752:123@cluster0.pavgn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("MongoDB Connected"))

app.set("view engine","ejs");
app.set('views', path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: false}))
app.use("/url",urlRoute);
app.use('/', staticRoute);

// app.get("/test", async(req,res)=>{
//     const allurl = await URL.find({});
//     return res.render('home', { allurl })
// });

app.get('/url/:shortId', async(req,res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
    {
        shortId,
    },
    {
        $push: {
            visitHistory: {
                timestamp: Date.now(),
            },
        }
    }
    );
    res.redirect(entry.redirectURL);
});



app.listen(PORT, ()=>{
    console.log(`Server started at ${PORT}`)
})