var http = require('http');
var fs= require('fs');
var querystring = require('querystring');

function requestHandler(req, res){

    var qs = querystring.parse(req.url.split("?")[1]);
    console.log("URLs: ", req.url.split("?")[0]);
    console.log("qs: ", qs);


    if(qs.data !== undefined && qs.data !==''){
        res.setHeader('Content-disposition', 'attachment; filename='+qs.filename+'.txt');
        res.write(qs.data);
        console.log("File Sent: ", qs.data);
        res.end();
    }
    else if(qs.uploadFile !== undefined){
        fs.readFile("./views/"+qs.uploadFile,function(err, data1){
            var d = data1.toString();

            if(err){
                console.log("Error in downloading: ", err);
            }
            else{
                // res.writeHead(200, { 'Content-Type': 'text/plain' });
                fs.readFile("./views/text.html",function(err, data){ 
                console.log("In text.html");
                // data = data.replace("No data", );
                data = data.toString().replace("Data", d.toString());
                d = d.replace(/\n/gi, "<br/>");
                data = data.replace("fn", qs.uploadFile.split('.')[0]);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
                res.write(`<html><body><div style="color: #2E86C1; font-family: PressStart;">
                    <h1 style="text-align: center; margin: 20px 0 20px 0;">
                        HTML File Preview</h1>
                    </div>
                <div style='margin-left: 380px; align: center; padding: 50px; margin-bottom: 100px;border:3px solid #3498DB; border-radius: 25px; width: 600px; font-size:`
                +qs.size+`px;'>`+d.toString()+`</div></body></html>`);
                res.end();
                })
            }
        });
    }
    else{
        fs.readFile("./views/text.html",function(err, data){ 
        console.log("In text.html");
        data = data.toString().replace("Data", "");
        data = data.toString().replace("fn*****fn", "");
        res.write(data);
        res.end();
        });
    }
    
}

http.createServer(requestHandler).listen(3000,function(req,res){
    console.log("Server has started!");
});