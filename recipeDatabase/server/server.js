import express from "express"
import https from 'https'
import cors from "cors"
import "dotenv/config"

const app = express()
const PORT = process.env.port || 5000

app.use(cors())

app.get('/recipes/:query', async (req, res) => {
    const query = encodeURIComponent(req.params.query);
    const appId = process.env.APP_ID;
    const appKey = process.env.APP_KEY;

    // Construct the URL with the encoded query parameter
    const url = `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${appKey}`;

    https.get(url, (output) => {
        let data = '';

        // Collect data chunks
        output.on('data', (chunk) => {
            data += chunk;
        });

        // When response ends
        output.on('end', () => {
            res.json(JSON.parse(data));
        });
    })
});

app.listen(PORT, () => {
    console.log((`listening to server ${PORT}`))
})