const errorHandler = (err, req, res, next) => {
  let errorMessage = "";
  console.log(err);

  switch (err.name) {
    //Auth error
    case "emailAlreadyExist":
      errorMessage = "Email Already Exist";
      res.status(400).json({ message: errorMessage });
      break;

    case "userNameAlreadyExist":
      errorMessage = "Username Already Exist";
      res.status(400).json({ message: errorMessage });
      break;

    case "passwordToShort":
      errorMessage = "Password Must Contain At least 8 Character";
      res.status(400).json({ message: errorMessage });
      break;

    case "invalidCredentials":
      errorMessage = "Invalid Credentials";
      res.status(400).json({ message: errorMessage });
      break;

    case "unauthenticated":
      errorMessage = "Authentication Required";
      res.status(401).json({ message: errorMessage });
      break;

    case "unauthorized":
      errorMessage = "Authorization Required";
      res.status(401).json({ message: errorMessage });

    // Base error
    case "notFound":
      errorMessage = "Error Not Found";
      res.status(404).json({ message: errorMessage });
      break;

    //Cart error
    case "cartNotFound":
      errorMessage = "Cart Id Not Found";
      res.status(404).json({ message: errorMessage });
      break;

    //User error
    case "userNotFound":
      errorMessage = "User Not Found";
      res.status(404).json({ message: errorMessage });
      break;

    case "failedToUpdateUser":
      errorMessage = "Failed to Update User";
      res.status(400).json({ message: errorMessage });
      break;

    //Product error
    case "productNotFound":
      errorMessage = "Product Not Found";
      res.status(404).json({ message: errorMessage });
      break;

    case "failedToCreateProduct":
      errorMessage = "Failed to Create Product";
      res.status(400).json({ message: errorMessage });
      break;

    case "failedToCreateProductImage":
      errorMessage = "Failed to Create Product Image";
      res.status(400).json({ message: errorMessage });
      break;

    case "failedToUpdateProduct":
      errorMessage = "Failed to Update Product";
      res.status(400).json({ message: errorMessage });
      break;

    case "failedToDeleteProduct":
      errorMessage = "Failed to Delete Product";
      res.status(400).json({ message: errorMessage });
      break;

    //Category error
    case "categoriesNotFound":
      errorMessage = "category Not Found";
      res.status(404).json({ message: errorMessage });
      break;

    case "failedGetCategoryData":
      errorMessage = "Failed Get Category Data";
      res.status(404).json({ message: errorMessage });
      break;

    case "updateCategoryFailed":
      errorMessage = "Update Category Failed";
      res.status(400).json({ message: errorMessage });
      break;

    //City error
    case "cityNotFound":
      errorMessage = "City Not Found";
      res.status(404).json({ message: errorMessage });
      break;

    //Province error

    case "provinceNotFound":
      errorMessage = "Province Not Found";
      res.status(404).json({ message: errorMessage });
      break;

    //Cart error
    case "cartNotFound":
      errorMessage = "Cart Not Found";
      res.status(404).json({ message: errorMessage });
      break;

    case "failedUpdateCart":
      errorMessage = "Failed to Update Cart";
      res.status(400).json({ message: errorMessage });
      break;

    case "failedTOResetCart":
      errorMessage = "Failed to Reset Cart";
      res.status(400).json({ message: errorMessage });
      break;

    case "failedTODeleteCart":
      errorMessage = "Failed to Delete Cart";
      res.status(400).json({ message: errorMessage });
      break;

    // Order error
    case "orderNotFound":
      errorMessage = "Order Not Found";
      res.status(404).json({ message: errorMessage });
      break;

    case "failedToFindAllOrder":
      errorMessage = "Failed to Find All Order";
      res.status(400).json({ message: errorMessage });
      break;

    case "failedToUpdatestatus":
      errorMessage = "Failed to Update Status Order";
      res.status(400).json({ message: errorMessage });
      break;

    case "paymentError":
      errorMessage = "Payment Error";
      res.status(400).json({ message: errorMessage });
      break;

    case "handleNotificationError":
      errorMessage = "Handle Notification Error";
      res.status(400).json({ message: errorMessage });
      break;

    //Stock error
    case "failedToAddStock":
      errorMessage = "Failed to Add Stock";
      res.status(400).json({ message: errorMessage });
      break;

    case "failedToGetStock":
      errorMessage = "Failed to Get Stock";
      res.status(400).json({ message: errorMessage });
      break;

    default:
      console.log(err);
      errorMessage = "Internal Server Error";
      res.status(500).json({ message: errorMessage });
      break;
  }
};

module.exports = errorHandler;
