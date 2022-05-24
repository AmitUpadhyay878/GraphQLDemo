import mongoose from 'mongoose'

const QuoteSchema = mongoose.Schema({

    name:{
        type:String,
        require:true
    },
    by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
        
    },
   
})

mongoose.model("Quote",QuoteSchema);