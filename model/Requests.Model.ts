import mongoose, { InferSchemaType } from "mongoose";


const requestSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  subject :{
    type: String,
    trim: true,
    required: true,
  },
  message : {
    type: String,
    required: true,
  }
  



    
},{
    timestamps: true,
})

type RequestsBase = InferSchemaType<typeof requestSchema>;
export type RequestsModelType = RequestsBase & {
  _id: mongoose.Types.ObjectId;
};



const Requests = mongoose.models.Requests || mongoose.model("Requests", requestSchema);

export default Requests;