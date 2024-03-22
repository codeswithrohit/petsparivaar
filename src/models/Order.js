const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    orderId: { type: String, required: true },
    paymentInfo: { type: String, default: '' },
    transactionid: { type: String, default: "" },
    email: { type: String, required: true },
    phonenumber: { type: Number, required: true },
    products: { type: Object, required: true },
    flatHouse: { type: String, required: true },
    locality: { type: String, required: true },
    location: { type: String, required: true },
    pincode: { type: String, required: true },
    petDetails: { type: Object, required: true }, // Change the type to Object
    amount: { type: Number, required: true },
    status: { type: String, default: 'Pending', required: true },
}, { timestamps: true });

mongoose.models = {};
export default mongoose.model("PetParivaarOrders", OrderSchema);
