const mongoose= require('mongoose');

const schema= mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    number:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    tags:[{
        type:String,
        
    }],
    notes:{
        type:String,
    },
    favourite:{
        type:Boolean,
        default:false
    },
    blocked:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
}
)

const Phonebook= mongoose.model('Phonebook',schema)
module.exports=Phonebook
