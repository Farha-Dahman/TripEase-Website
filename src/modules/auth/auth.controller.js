import bcrypt from "bcryptjs";
import cloudinary from "../../services/cloudinary.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../services/email.js";
import { customAlphabet } from "nanoid";
import userModel from "../../db/model/user.model.js";

export const signup = async (req, res, next) => {
  const { userName, email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    return next(new Error("email already exist!", { cause: 409 }));
  }
  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT_ROUND)
  );

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APP_NAME}/users`,
    }
  );
  const token = jwt.sign({ email }, process.env.CONFIRM_EMAIL_SECRET, {
    expiresIn: "1h",
  });
  sendEmail(
    email,
    "Confirm Your Email",
    `Click here to <a href='${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}'>Verify Email</a>`
  );

  const createUser = await userModel.create({
    userName,
    email,
    password: hashedPassword,
    image: { public_id, secure_url },
  });
  return res.json({ message: "success", createUser });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("data Invalid", { cause: 400 }));
  }
  if (!user.confirmEmail) {
    return next(new Error("plz confirm your email", { cause: 400 }));
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return next(new Error("data Invalid", { cause: 400 }));
  }
  const token = jwt.sign(
    { id: user._id, role: user.role, status: user.status },
    process.env.LOGIN_SECRET,
    { expiresIn: "10m" }
  );
  const refreshToken = jwt.sign(
    { id: user._id, role: user.role, status: user.status },
    process.env.LOGIN_SECRET,
    { expiresIn: 60 * 60 * 24 * 30 }
  );

  return res.status(200).json({ message: "success", token, refreshToken });
};

export const confirmEmail = async (req, res, next) => {
  const { token } = req.params;
  const decode = jwt.verify(token, process.env.CONFIRM_EMAIL_SECRET);
  if (!decode) {
    return next(new Error("Invalid token", { cause: 404 }));
  }
  const user = await userModel.findOneAndUpdate(
    { email: decode.email, confirmEmail: false },
    { confirmEmail: true }
  );
  if (!user) {
    return next(
      new Error("Invalid verifying email or your email is already verified", {
        cause: 400,
      })
    );
  }
  return res.status(200).json({ message: "Your email is verified" });
};

export const sendCode = async (req, res, next) => {
  const { email } = req.body;
  let code = customAlphabet("1234567890", 6);
  code = code();
  const user = await userModel.findOneAndUpdate(
    { email },
    { sendCode: code },
    { new: true }
  );
  const html = `<h2>code: ${code}</h2>`;
  await sendEmail(email, `reset password`, html);
  return res.status(200).json({ message: "success", user });
};

export const forgetPassword = async (req, res, next) => {
  const { email, password, code } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("Not register account!", { cause: 404 }));
  }
  if (user.sendCode != code) {
    return next(new Error("Invalid code!", { cause: 400 }));
  }
  user.password = await bcrypt.hash(password, parseInt(process.env.SALT_ROUND));
  user.sendCode = null;
  user.changePasswordTime = Date.now();
  await user.save();
  return res.status(200).json({ message: "success" });
};
