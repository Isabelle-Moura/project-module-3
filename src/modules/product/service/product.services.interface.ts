import { IProduct } from "../model/product.model.interface";

export interface IProductService {
   getAllProducts(): Promise<IProduct[]>;
   getProductById(productId: string): Promise<IProduct | null>;
   createProduct(product: IProduct, photo: string): Promise<IProduct>;
   updateProduct(productId: string, newData: IProduct): Promise<IProduct | null>;
   redeemProduct(userId: string, productId: string): Promise<IProduct | null>;
}
