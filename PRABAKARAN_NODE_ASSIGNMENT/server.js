var fs = require('fs');
var data = fs.readFileSync('db.json');
//converting as json object
var words = JSON.parse(data);
//console.log(words);

var express = require('express');
var app = express();
var bodyParser =  bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hello Express!')
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

//Get all products
app.get('/all', sendAll);

function sendAll(request, response) {
  //console.log(Object.keys(words).length);
  response.send(words);
}

//Add product
app.post('/addProduct', addProduct);

function addProduct(request, response) {
    var data = request.body;
    var word = data.word;
  var score = data.score;
  words[word] = score;
      writeDBFile();
      response.send("product added successfully");  
    }
 
 //Update product
 app.put('/updateProduct', updateProduct);

  function updateProduct(request, response) {    
    var data = request.body;
    var word = data.word;
  var score = data.score;
  words[word] = score;
      writeDBFile();
      response.send("product updated successfully");
  }

 //Delete product
 app.delete('/deleteProduct/:id', deleteProduct);
 
   function deleteProduct(request, response) {
          delete words["product" + request.params.id];
          //console.log( words );
          writeDBFile();
           response.send("product deleted successfully");           
   }

  //Get product by id
  app.get('/search/id/:id', getById);
  
  function getById(request, response) {
    console.log(request.params.id);
       var result = words["product" + request.params.id];
      //console.log( words["product" + request.params.id].productName);
       response.send(result);     
 }
  
//Search product by name
app.get('/search/name/:name', getByName);
  
function getByName(request, response) {
  var product = request.params.name;  
  var productNumber = 0;
  var result = 0;
  var length = Object.keys(words).length;
  for(var i=1; i<=length;i++){
			  if(words["product"+i].productName == product){
			  productNumber = i;
			  result = words["product" + i];
  }
}
        //console.log(result);
        response.send(result);
}

//group by category
app.get('/search/category', getByCategory);
function getByCategory(request, response) {
  var mobileResult = "";
  var tabletResult = "";
  var phabletResult = "";
  var resultArr = new Array();
  var mobileArr = new Array();
  var tabletArr = new Array();
  var phabletArr = new Array();
  var j = 0;
  var k = 0;
  var l = 0;
  var length = Object.keys(words).length;
  for(var i=1; i<=length;i++){
    var category = words["product"+i].category;
    if( category == "mobile"){
      mobileArr[j] = i;
     j++;
    }
    else if(category == "tablet"){
      tabletArr[k] = i;
      k++;
    }
    else if(category == "phablet"){
      phabletArr[l] = i;
      l++;
    }
  }
  for(var i =0; i<mobileArr.length;i++){
    mobileResult = mobileResult+" " +words["product"+mobileArr[i]].productName;
  }    
  for(var i =0; i<tabletArr.length;i++){
    tabletResult = tabletResult+" " + words["product"+tabletArr[i]].productName;
  } 
  for(var i =0; i<phabletArr.length;i++){
    phabletResult = phabletResult +" " +words["product"+phabletArr[i]].productName;
  } 
  resultArr = [{"mobile": mobileResult},{"tablet": tabletResult},{"phablet": phabletResult}];
  var myJsonStringResult = JSON.stringify(resultArr);
  response.send(myJsonStringResult);
}

//Global search
app.get('/search/global/:id/:property', getByGlobal);
function getByGlobal(request, response) {
  var id = request.params.id;
  var property = request.params.property;
  console.log(property);
  switch (property) {
    case "id": 
        result = words["product"+id].id;
        break;
    case "productName": 
        result = words["product"+id].productName;
        break;
    case "price":
        result = words["product"+id].price;
        break;
    case "inTheBox": 
        result = words["product"+id].inTheBox;
        break;
    case "modelNumber": 
        result = words["product"+id].modelNumber;
        break;
    case "size": 
        result = words["product"+id].size;
        break;
    case "category": 
        result = words["product"+id].category;
		break;
	case "color":
        result = words["product"+id].color;
		break;
	case "touchScreen":
        result = words["product"+id].touchScreen;
		break;
	case "image":
        result = words["product"+id].image;
		break;
	default:
		result = "no result";
		
}
response.send(result);
}

//write in db  
function writeDBFile(){
  var data2 = JSON.stringify(words, null, 2);
  fs.writeFile('db.json', data2);   
}


  
