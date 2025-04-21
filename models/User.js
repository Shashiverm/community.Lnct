import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
      lowercase: true,
      index: true, // Add index for faster queries
    },
    role: {
      type: String,
      enum: ["student", "faculty", "alumni", "admin"],
      default: "student",
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profileImage: {
      type: String,
      default: "default-profile.jpg",
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot be more than 500 characters"],
    },
    department: String,
    graduationYear: Number,
    enrollmentNumber: {
      type: String,
      sparse: true, // Allow null/undefined values
      index: true, // Add index for faster queries
    },
    connections: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    connectionRequests: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    lastActive: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Create compound index for faster searches
UserSchema.index({ name: "text", department: "text", bio: "text" })

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex")

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

  return resetToken
}

// Generate email verification token
UserSchema.methods.getEmailVerificationToken = function () {
  // Generate token
  const verificationToken = crypto.randomBytes(20).toString("hex")

  // Hash token and set to emailVerificationToken field
  this.emailVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex")

  // Set expire
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000

  return verificationToken
}

// Virtual for posts
UserSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "user",
  justOne: false,
})

// Virtual for events
UserSchema.virtual("events", {
  ref: "Event",
  localField: "_id",
  foreignField: "organizer",
  justOne: false,
})

// Virtual for resources
UserSchema.virtual("resources", {
  ref: "Resource",
  localField: "_id",
  foreignField: "user",
  justOne: false,
})

export default mongoose.model("User", UserSchema)
