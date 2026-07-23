import mongoose ,{ InferSchemaType} from "mongoose";


const invertorySchema = new mongoose.Schema({
productName : {
    type : String,
    required : true,
},
quantity : {
    type : Number,
    required : true,
},
addBy : {
    type : String,
    required : true,
},

},{
    timestamps : true,
})


type basetype = InferSchemaType<typeof invertorySchema>
export type inventoryType = basetype & {
    _id : mongoose.Types.ObjectId
}


const Inventory =mongoose.models.Inventory || mongoose.model("Inventory",invertorySchema)