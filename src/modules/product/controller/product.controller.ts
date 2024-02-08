import { Request, Response } from "express";
import { IProductService } from "../service/product.services.interface";
import { ErrorsResponse } from "../../../utils/errors/errors.response";
import { env } from "../../../config/dotenv";
import { productBodyValidator } from "../utils/product-body.validator";
import { IUserService } from "../../user/service/user.services.interface";
import { JwtToken } from "../../auth/utils/jwt";

export class ProductController {
   constructor(private service: IProductService, private userService: IUserService) {}

   async findAllAvailableProducts(req: Request, res: Response) {
      try {
         const products = await this.service.findAllAvailableProducts();

         if (!products) {
            throw ErrorsResponse.notFound();
         }

         res.status(200).json({ success: true, data: products });
      } catch (error: any) {
         res.status(500).json({ error: true, message: error.message });
      }
   }

   async createProduct(req: Request, res: Response) {
      try {
         const { body } = req;
         const { file } = req;

         // Check for file presence before validation
         if (!file) {
            res.status(400).json({
               error: true,
               message: "Please select a photo.",
               status: 400,
            });
         }

         const bodyValidation = {
            name: body.name,
            description: body.description,
            value: body.value,
            quantity: body.quantity,
            photo: file?.originalname,
         };

         await productBodyValidator(bodyValidation);

         const product = await this.service.createProduct(body, file?.filename as string);

         const imageUrl = `${env.BASE_URL}/uploads/${file?.filename}`;

         res.status(201).json({
            success: true,
            message: "Product was created successfully!",
            status: 201,
            data: { product, imageUrl },
         });
      } catch (error: any) {
         res.status(500).json({ error: true, message: error.message });
      }
   }

   async findById(req: Request, res: Response) {
      try {
         const { id } = req.params;

         const product = await this.service.findById(id);

         if (!product) {
            throw ErrorsResponse.notFound();
         }

         res.status(200).json({ success: true, data: product });
      } catch (error: any) {
         res.status(500).json({ error: true, message: error.message });
      }
   }

   async updateProduct(req: Request, res: Response) {
      try {
         const { id } = req.params;
         const { body } = req;

         const product = await this.service.updateProduct(id, body);

         if (!product) {
            throw ErrorsResponse.customError("It was not possible to update the product", 500);
         }

         res.status(200).json({ success: true, data: product });
      } catch (error: any) {
         res.status(500).json({ error: true, message: error.message });
      }
   }

   async redeemProduct(req: Request, res: Response) {
      try {
         const token: any = req.headers["authorization"]?.split(" ")[1];
         const { productId } = req.params;
         console.log("Token:", token);
         console.log("ProductId:", productId);

         const decodedToken: any = await JwtToken.verifyToken(token);
         const userId = decodedToken.id;
         console.log("Id do Token:", userId);

         if (!userId || !productId) {
            throw ErrorsResponse.customError("It was not possible to redeem the product", 500);
         }

         const redeemedProduct = await this.service.redeemProduct(userId, productId);
         console.log("Redeemed Product:", redeemedProduct);

         if (!redeemedProduct) {
            throw ErrorsResponse.customError("Failed to redeem the product", 500);
         }

         const updatedUser = await this.userService.getUserById(userId);

         if (!updatedUser) {
            throw ErrorsResponse.customError("Failed to get updated user information", 500);
         }

         res.status(200).json({
            success: true,
            message: "Product was redeemed successfully!",
            data: { user: updatedUser, redeemedProduct },
         });
      } catch (error: any) {
         res.status(500).json({ error: true, message: error.message });
      }
   }
}
