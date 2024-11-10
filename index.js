const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Route to get a random fact
app.get('/api/randomfact', async (req, res) => {
    try {
        // Fetch a random fact from the Useless Facts API
        const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
        const factData = await response.json();

        // Save the fact to facts.json file
        const savedFact = { fact: factData.text, source: factData.source_url };
        fs.readFile(path.join(__dirname, '../data/facts.json'), 'utf8', (err, data) => {
            if (err) console.error("Error reading facts file:", err);

            const facts = data ? JSON.parse(data) : [];
            facts.push(savedFact);

            fs.writeFile(path.join(__dirname, '../data/facts.json'), JSON.stringify(facts, null, 2), (err) => {
                if (err) console.error("Error saving fact:", err);
            });
        });

        // Send the fact as JSON response
        res.json(savedFact);
    } catch (error) {
        console.error("Error fetching fact:", error);
        res.status(500).json({ error: "Failed to fetch random fact" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
