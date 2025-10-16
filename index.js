const express = require('express');
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
dotenv.config();


const app = express();
app.use(express.json());

const middleware = (req, res, next) => {
  const apiauthkey = req.headers['apiauthkey'];

  

  if (!apiauthkey) {
    return res.status(400).json({ 
   "error": "apiauthkey is missing or invalid"
});
  }
  if(apiauthkey!==process.env.API_AUTH_KEY){
    return res.status(403).json({ 
   
  "error": "Failed to authenticate apiauthkey"

});
  }
  next();
}

app.use(middleware);



app.post("/api/cart/addProduct", async (req,res)=>{

  const { userId, productId, count } = req.body;

  if (!userId || !productId || !count) {
    return res.status(400).json({
      error: "Missing required fields"
    });
  }

  try {

    // const existingCartItem = await prisma.cart.findFirst({
    //   where: {
    //     userId,
    //     productId
    //   }
    // });

    // if (existingCartItem) {
      
      
    //   return res.status(200).json(
    //     { message: "Product already in cart" }
    //   );
    // }

    console.log(userId, productId, count);
    const cartItem = await prisma.cart.create({
      data: {
        userId,
        productId,
        count
      }


    });
    res.status(201).json(cartItem);
  } catch (error) {
    console.error(error);
   
    res.status(500).json({
      
      error: "Internal server error "+error.message
    });

  }
});

app.get("/api/cart/getById/:id", async (req,res)=>{
  const {id} = req.params;
  const newId = parseInt(id);

  if (isNaN(newId)){
    return res.status(400).json({
      "error": "Cart not found"
    })};

    const item = await prisma.cart.findUnique({
      where: {
        cartId: newId
      }
    });

    if (!item) {
      return res.status(404).json({
        "error": "Cart not found"
      });
    }

    res.status(200).json(item);
  }

)

app.put("/api/cart/patch/:id", async (req,res)=>{
  const {id} = req.params;
  const newId = parseInt(id);
  const { count } = req.body;

  if (isNaN(newId)) {
    return res.status(400).json({
      "error": "Invalid id parameter"
    });
  }

  if (!count) {
    return res.status(400).json({
      "error": "Missing required fields"
    });
  }

  try {
    const item = await prisma.cart.update({
      where: {
        cartId: newId
      },
      data: {
        count
      }
    });
    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      "error": "Internal server error"
    });
  }
});

app.delete("/api/cart/removeProduct/:id", async (req,res)=>{
  const {id} = req.params;
  const newId = parseInt(id);

  if (isNaN(newId)) {
    return res.status(400).json({
      "error": "Invalid id parameter"
    });
  }

  try {
    const deleteitem = await prisma.cart.delete({
      where:{
        cartId: newId
      }
      
    })

    return res.status(200).json(deleteitem);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      "error": "Internal server error"+error.message
    });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;