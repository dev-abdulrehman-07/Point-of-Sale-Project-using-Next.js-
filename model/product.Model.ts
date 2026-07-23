import dbConnection from "@/lib/database/dbConnection";
import mongoose from "mongoose";
import { InferSchemaType } from "mongoose";
import { Item } from "./Item";

const productSchema = new mongoose.Schema({
    image: {
        type: String, 
        required: false 
    },
    title: {
        type: String, 
        required: true
    },
    category: {
        type: String, 
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true 
    },
    quantity: {
        type: Number,
    },
    price: {
        type: Number, 
        required: true
    },
    
    Recipe: [
        {
            Item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Item",
                required: true
            },
            Quantity: {
                type: Number,
                required: true
            }
        }
    ]
}, {
    timestamps: true, 
    
});

productSchema.pre("save",async function (){

const product = this;
await dbConnection();
if (!product.Recipe || product.Recipe.length === 0) {
    product.quantity = 0;
    return; 
  }



  try {
    const quantities: number[] = [];

    for (const recipeItem of product.Recipe) {
        const foundItem: any = await Item.findById(recipeItem.Item);

        const currentStock = foundItem ? foundItem.currentStock : 0; 
        const requiredQty = recipeItem.Quantity;

        if (requiredQty > 0) {
            const possibleQty = Math.floor( currentStock / requiredQty );
            quantities.push(possibleQty);
        } else {
            quantities.push(0);
        }
    }

    if (quantities.length > 0) {
        product.quantity = Math.min(...quantities);
    } else {
        product.quantity = 0;
    }

    return; 
} catch (error) {
    return(error); 
}



})




interface recipe {
    Item: string,
    Quantity: number
}


export type cardDataType = {
    _id: mongoose.Types.ObjectId | string; 
    image?: string;
    title: string;
    category: string;
    description: string;
    isActive: boolean;
    quantity: number;
    price: number;
    Recipe: recipe[] ; 
};

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);