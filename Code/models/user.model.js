const mongoose = require("mongoose");

const userSchema = {
    name: {
        type: String,
        required: "This field is required"
    },
    password: {
        type: String,
        required: "This field is required"
    }
};

mongoose.model("User", userSchema);