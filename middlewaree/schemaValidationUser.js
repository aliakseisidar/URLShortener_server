const yup = require("yup");

module.exports = async function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    //timeout
    await new Promise((resolve) => setTimeout(resolve, 3000));
    //end timeout
    let schema = yup.object().shape({
      username: yup
        .string("Username should be string")
        .required("Username cannot be empty"),
      password: yup
        .string("Password should be string")
        .required("Password cannot be empty"),
      role: yup
        .string("Role should be string")
        .required("Role cannot be empty"),
    });
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ messages: error.errors });
  }
};
