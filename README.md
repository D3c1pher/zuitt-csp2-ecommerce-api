# Capstone 2 Ecommerce API App Overview:
- - -
## **Application Name: Ecommerce API-App**
- - -
### **Team Members:**
- - -
- **Norven Caracas**
- **Shelly Noval**
- - -
### **User Credentials:**
- - -
* ####  Admin User:
| User | Info | 
| ------ | ------ | 
| **email:** | admin@email.com |
| **password:** | Admin123* |
| ------ | ------ | 
| **email:** | testadmin@email.com |
| **password:** | testAdmin123* |
* #### Dummy Customer:
| User | Info | 
| ------ | ------ | 
| **email:** | customer@mail.com |
| **password:** | Customer123* |
| ------ | ------ | 
| **email:** | testcustomer@email.com |
| **password:** | testCustomer123* |
- - -
### **Features:**
- - -
#### Features by Norven Caracas:

User Resources:
* User Model Design
* User Rigistration - _Modified_
* User Authentication - _Modified_
* Set user as admin (Admin only)
* Retrieve User Details

Product Resources:
* Product Model Design
* Create Product (Admin only)
* Retrieve all products (Admin only) - _Revised_
* Archive Product (Admin only)
* Activate Product (Admin only)
* Product search product by name
* Product search product by price

Cart Resources:
* Cart Model Design - _Modified_
* Get User's Cart
* Add to Cart
* Subtotal for each item
* Total price for all items
* Change product quantities
* Remove products from cart - _Modified_
* Clear Cart - _Modified_
* Cart search product by name - _Modified_ - _Addition_
* Cart search product by price - _Modified_ - _Addition_

Order Resources:
* Order Model Design - _Modified_
* ...

Additional Resources:
* Error Handler and Middleware - ./utils/error.js
* Validation functionalities for user features - ./helper/userHelper.js
* Helper functionalities for cart features - ./helpers/cartHelper.js
- - -
#### Features by Shelly Noval:

User Resources:
* User Rigistration - _Base_
* User Authentication - _Base_
* Update Password

Product Resources:
* Retrieve all products (Admin only) - _Base_
* Retrieve all active products
* Retrieve single product
* Update Product information (Admin only)

Cart Resources:
* Cart Model Design - _Base_
* Remove products from cart - _Base_
* Clear Cart - _Base_
* Cart search product by name - _Base_
* Cart search product by price - _Base_

Order Resources:
* Order Model Design - _Base_
* ...
- - -