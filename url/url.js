addEventListener('submit', (event) => {

  event.preventDefault();

  //to get data
  const formData = new FormData(event.target);
  const url = formData.get("url");
  const shortCode = formData.get("shortCode");

  console.log(url,shortCode);
})



import { readFile } from "fs";
import { createServer } from "http";
import path from "path";

const PORT = 3002;

const server = createServer(async(req, res) => {
  if(req.method === "GET"){
    if(req.url === "/"){
    try {
      const data = await readFile(path.join("public","url.html"))
      res.writeHead(200,{"Content-Type":"text/html"});
      res.end(data);
    }
     catch (error) {
      res.writeHead(404,{"Content-Type":"text/html"});
      res.end("404 Page not found");
    }
  }
}
})
server.listen(PORT, ()=>{
  console.log(`Server running at http://localhost:${PORT}`);
});

