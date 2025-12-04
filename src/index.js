const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 5005;

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

app.use(express.static('public'));

function sortJson(obj, options = {}) {
    const { indentation = 'spaces', arbSupport = false } = options;

    // Helper to sort objects recursively
    function sortObject(obj, options) {
        const { order = 'asc', plainArrays = false } = options;

        if (Array.isArray(obj)) {
            // If it's a plain array and plainArrays is enabled, sort it
            if (plainArrays && obj.every(item => typeof item !== 'object')) {
                return obj.sort((a, b) => {
                    if (order === 'asc') {
                        return a > b ? 1 : -1;
                    } else {
                        return a < b ? 1 : -1;
                    }
                });
            }

            if(plainArrays) {
                // Sort arrays of objects by their keys
                return obj.map(item => {
                    if (typeof item === 'object' && item !== null) {
                        return sortObject(item, options);
                    }
                    return item;
                }).sort((a, b) => {
                    if (typeof a === 'object' && typeof b === 'object') {
                        // Compare the first key of each object
                        const aKeys = Object.keys(a).sort(order === 'asc' ? undefined : (x, y) => y.localeCompare(x));
                        const bKeys = Object.keys(b).sort(order === 'asc' ? undefined : (x, y) => y.localeCompare(x));
                        return order === 'asc' ? aKeys[0].localeCompare(bKeys[0]) : bKeys[0].localeCompare(aKeys[0]);
                    }
                    if (order === 'asc') {
                        return a > b ? 1 : -1;
                    } else {
                        return a < b ? 1 : -1;
                    }
                });
            } else {
                return obj.map(item => sortObject(item, options));
            }
        } else if (typeof obj === 'object' && obj !== null) {
            // Handle ARB files
            if (arbSupport && isFlutterArb(obj)) {
                return sortFlutterArb(obj, options);
            }

            return Object.keys(obj).sort(order === 'asc' ? undefined : (a, b) => b.localeCompare(a))
                .reduce((sorted, key) => {
                    sorted[key] = sortObject(obj[key], options);
                    return sorted;
                }, {});
        }
        return obj;
    }

    // Detect if the object is a Flutter ARB file
    function isFlutterArb(obj) {
        return obj['@@locale'] !== undefined;
    }

    // Sort ARB files while preserving comments
    function sortFlutterArb(obj, options) {
        const { order = 'asc' } = options;
        const comments = {};
        const data = {};

        for (const key in obj) {
            if (key.startsWith('@')) {
                comments[key] = obj[key];
            } else {
                data[key] = obj[key];
            }
        }

        const sortedKeys = Object.keys(data).sort(order === 'asc' ? undefined : (a, b) => b.localeCompare(a));

        let sortedData = {};

        // Add @@locale at the beginning for asc order
        if ('@@locale' in obj && order === 'asc') {
            sortedData['@@locale'] = obj['@@locale'];
        }

        sortedKeys.forEach(key => {
            if (`@${key}` in comments) {
                sortedData[`@${key}`] = sortObject(comments[`@${key}`], options);
            }
            sortedData[key] = sortObject(data[key], options);
        });

        // Add @@locale at the end for desc order
        if ('@@locale' in obj && order === 'desc') {
            sortedData['@@locale'] = obj['@@locale'];
            // Move @@locale to the end by reordering the keys
            const keys = Object.keys(sortedData);
            const localeIndex = keys.indexOf('@@locale');
            if (localeIndex !== -1) {
                keys.splice(localeIndex, 1); // Remove @@locale from its current position
                keys.push('@@locale'); // Add it to the end
                sortedData = keys.reduce((result, key) => {
                    result[key] = sortedData[key];
                    return result;
                }, {});
            }
        }

        return sortedData;
    }

    const sortedObj = sortObject(obj, options);

    // Convert the sorted object to JSON with the desired indentation
    const indentChar = indentation === 'tabs' ? '\t' : ' ';
    return JSON.stringify(sortedObj, null, indentChar === ' ' ? 2 : indentChar);
}

app.post('/sort', (req, res) => {
    const { json, order = 'asc', plainArrays = true, indentation = 'spaces', arbSupport = false } = req.body;

    try {
        let parsedJson = typeof json === 'string' ? JSON.parse(json) : json;

        // Order and sort the JSON with the provided options
        const sortedJson = sortJson(parsedJson, { order, plainArrays, indentation, arbSupport });

        res.set('Content-Type', 'application/json');
        res.send(JSON.parse(sortedJson));
    } catch (error) {
        res.status(400).json({ error: 'Error parsing JSON: ' + error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.resolve('public', 'index.html'));
});

app.get('/robots.txt', (req, res) => {
    res.sendFile(path.resolve('', 'robots.txt'));
});
app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.resolve('', 'sitemap.xml'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = { sortJson };