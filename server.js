const http = require("http");
const app = require("./app");

const server = http.createServer(app);

const PORT = process.env.PORT;

server.listen(PORT, (err) => {
    if (err) console.log('error in starting server : ', err);
    else console.log(`server is running on http://localhost:${PORT}`);
});