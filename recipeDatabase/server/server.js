import express from "express"
import https from 'https'
import cors from "cors"
import "dotenv/config"

const app = express()
const PORT = process.env.port || 5000

app.use(cors())

app.get('/recipes/:query?', async (req, res) => {
    const query = req.params.query || 'default';
    const encodedQuery = encodeURIComponent(query);
    const appId = process.env.APP_ID;
    const appKey = process.env.APP_KEY;

    // Construct the URL with the encoded query parameter
    const url = `https://api.edamam.com/search?q=${encodedQuery}&app_id=${appId}&app_key=${appKey}`;

    https.get(url, (output) => {
        let data = '';

        // Collect data chunks
        output.on('data', (chunk) => {
            data += chunk;
        });

        // When response ends
        output.on('end', () => {
            const item = JSON.parse(data);
            
            const recipes = item.hits.map(hit => {
                return {
                    name: hit.recipe.label,
                    ingredients: hit.recipe.ingredients.map(ingredient => ingredient.text)
                }
            })
            res.json(recipes)
        });
    })
});

app.listen(PORT, () => {
    console.log((`listening to server ${PORT}`))
})

// import express from "express"
// import axios from "axios"
// import cors from "cors"
// import "dotenv/config"

// const app = express()
// const PORT = process.env.PORT || 5000

// app.use(cors())

// app.get('/recipes/:query', async (req, res) => {
//     const response = await axios.get(
//         `https://api.edamam.com/search?q=${req.params.query}&app_id=${process.env.APP_ID}&app_key=${process.env.APP_KEY}`
//     )
//     console.log(response.data.hits)
//     res.json(response.data.hits)
// })

// app.listen(PORT, () => {
//     console.log(`Server is listening on port ${PORT}`)
// })