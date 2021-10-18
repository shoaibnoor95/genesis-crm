const mongoose = require("mongoose");
const validator = require("validator");

const saleSchema = new mongoose.Schema(
  {
    FullName: {
      type: String,
      required: true,
      trim: true
    },
    ContactNumber: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (validator.isMobilePhone(value)) {
          throw new Error("You must enter valid contact number");
        }
      }
    },
    Status: {
      type: String,
      enum: ['Transfer','Pending','Approved',"Kick Back",'Rejected','Charged Back','Call Back'],
      default: "Pending"
    },
    KickBack: "",
    State: String,
    City: String,
    ZipCode: Number,
    Email: String,
    MotherMediansName: String,
    SocialSecurityNumber: String,
    Notes: String,

    SecurityWord: String,
    HighestLevelofEducation: {
      type: String,
      enum: [
        "Select",
        "Less than a high school diploma",
        "High school diploma or GED",
        "Some college or associate degree",
        "Bachelor's Degree",
        "Advanced/Graduate Degree"
      ],
        default: "Select"
    },
    EmploymentStatus: {
      type: String,
      enum: [
        "Select",
        "Employed Full-Time",
        "Employed Part-Time",
        "Self-Employed",
        "Unemployed",
        "Retired",
        "Other",
        "College Student"
      ],
      default: "Select"

    },
    HousingStatus: {
      type: String,
      enum: ["Select","Own Home", "Rent", "Other"],
      default: "Select"
    },
    Company: String,
    Designation: String,
    Annualincome: Number,
    ChequinAccounts: {
      type: String,
      enum: ["Select","Chequin", "Saving", "Chequin-Saving", "None"],
      default: "Select"
    },
    OtherLoans: {
      type: String,
      enum: ["Select","Loan", "Mortgages", "Loan-Mortgages", "Other"],
      default: "Select"
    },
    MonthlyRentMortgage: { type: Number },
    AgentId: {
      type: mongoose.Schema.Types.ObjectId,//when you use in axios  wrapp this id in  ObjectId()
      required: false, // this would be true 
      ref: "User"
    },
    CloserId: {
      type: mongoose.Schema.Types.ObjectId,//when you use in axios  wrapp this id in  ObjectId()
      required: false, // this would be true 
      ref: "User"
    },
    AdminId: {
      type: mongoose.Schema.Types.ObjectId,//when you use in axios  wrapp this id in  ObjectId()
      required: false, // this would be true 
      ref: "User"
    },
    CloserStatus:  {
      type: String,
      enum: ['Transfer','Pending','Approved',"Kick Back",'Rejected','Charged Back','Call Back'],
      default: "Pending"
    },
    AgentStatus:  {
      type: String,
      enum: ['Transfer','Pending','Approved',"Kick Back",'Rejected','Charged Back','Call Back'],
      default: "Pending"
    },
    AdminStatus:  {
      type: String,
      enum: ['Transfer','Pending','Approved',"Kick Back",'Rejected','Charged Back','Call Back'],
      default: "Pending"
    },
    CloserNotes:{
      type: String
    },
    AgentNotes: String

  },
  { timestamps: true }
);

      const Sale = mongoose.model("Sale", saleSchema);
      
      module.exports = Sale;
