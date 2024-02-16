const {
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
  } = require("http-status-codes");
  const { jwtSecret, refressSecret, loginPath, host, confirmPath, applicaionName } = require("../../config/setting");
  const User = require("../../models/user");
  const jwt = require("jsonwebtoken");
  const bcrypt = require("bcrypt");
  const createMailOptions = require("../../mail/mailOptions");
  const transporter = require("../../mail/mailTransporter");
  
  const register = async (req, res) => {
    var { firstName, lastName, email, password, username } = req.body;
    if (!username) {
      username = email.split("@")[0];
    }
    if (!firstName || !lastName || !email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please Provide Required Information",
        statusCode: StatusCodes.BAD_REQUEST,
        status: ReasonPhrases.BAD_REQUEST,
      });
    }
  
    const hash_password = await bcrypt.hash(password, 10);
  
    const userData = {
      firstName,
      lastName,
      email,
      hash_password,
      username,
    };
  
    const user = await User.findOne({ email });
    const userId = await User.findOne({ username });
  
    if (user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: `User with email ${user.email} already registered`,
        statusCode: StatusCodes.BAD_REQUEST,
        status: ReasonPhrases.BAD_REQUEST,
      });
    } else if (userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: `User Id ${userId.username} is already taken`,
        statusCode: StatusCodes.BAD_REQUEST,
        status: ReasonPhrases.BAD_REQUEST,
      });
    } else {
      const token = jwt.sign(
        {
          email: userData.email,
          id: userData.id,
        },
        jwtSecret,
        {
          expiresIn: "1h",
        }
      );
      User.create({
        ...userData,
        confirmToken: token,
        isEmailconfirm: false,
      }).then((data, err) => {
        if (err)
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: err.message,
            statusCode: StatusCodes.BAD_REQUEST,
            status: ReasonPhrases.BAD_REQUEST,
          });
        else {
          let mailBody = {
            body: {
              name: data.fullName,
              intro: `Welcome to ${applicaionName}! We are excited to have you on board.`,
              additionalInfo: `Thank you for choosing ${applicaionName}. You now have access to our premium features, including unlimited storage and priority customer support.`,
              action: {
                instructions: `To get started with ${applicaionName}, please click here:`,
                button: {
                  color: "#22BC66", // Optional action button color
                  text: "Confirm Your Account",
                  link: `${host}/${confirmPath}?token=${token}`,
                },
              },
              outro:
                "Need help, or have questions? Just reply to this email, we'd love to help.",
            },
          };
          transporter
            .sendMail(
              createMailOptions(
                "salted",
                data.email,
                `Welcome to ${applicaionName} - Confirm Your Email`,
                mailBody
              )
            )
            .then(() => {
              res.status(StatusCodes.CREATED).json({
                message: "User created Successfully",
                status: ReasonPhrases.CREATED,
                statusCode: StatusCodes.CREATED,
              });
            })
            .catch((error) => {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                status: ReasonPhrases.INTERNAL_SERVER_ERROR,
              });
            });
        }
      });
    }
  };
  
  const login = async (req, res, next) => {
    try {
      if (!req.body.email || !req.body.password) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "Please enter email and password",
          statusCode: StatusCodes.BAD_REQUEST,
          status: ReasonPhrases.BAD_REQUEST,
        });
      } else {
        const user = await User.findOne({ email: req.body.email });
  
        if (!user) {
          res.status(StatusCodes.NOT_FOUND).json({
            message: "Inavalid User Name!",
            statusCode: StatusCodes.NOT_FOUND,
            status: ReasonPhrases.NOT_FOUND,
          });
        } else {
          if (!user.isVerified) {
            const token = jwt.sign(
              {
                email: user.email,
                id: user.id,
              },
              jwtSecret,
              {
                expiresIn: "2h",
              }
            );
  
            User.updateOne(
              { _id: user.id },
              { $set: { confirmToken: token } },
              { upsert: true }
            ).then((data, err) => {
              if (err)
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                  message: err.message,
                  status: ReasonPhrases.INTERNAL_SERVER_ERROR,
                  statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                });
              else {
                let mailBody = {
                  body: {
                    name: user.fullName,
                    intro: `Welcome to ${applicaionName}! We are excited to have you on board.`,
                    additionalInfo: `Thank you for choosing ${applicaionName}. You now have access to our premium features, including unlimited storage and priority customer support.`,
                    action: {
                      instructions: `To get started with ${applicaionName}, please click here:`,
                      button: {
                        color: "#22BC66", // Optional action button color
                        text: "Confirm Your Account",
                        link: `${host}/${confirmPath}?token=${token}`,
                      },
                    },
                    outro:
                      "Need help, or have questions? Just reply to this email, we'd love to help.",
                  },
                };
                transporter
                  .sendMail(
                    createMailOptions(
                      "salted",
                      user.email,
                      `Welcome to ${applicaionName} - Confirm Your Email`,
                      mailBody
                    )
                  )
                  .then(() => {
                    res.status(StatusCodes.FORBIDDEN).json({
                      message:
                        "User is Not Activate! Please check email to activate your account",
                      statusCode: StatusCodes.FORBIDDEN,
                      status: ReasonPhrases.FORBIDDEN,
                    });
                  })
                  .catch((error) => {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                      message: error.message,
                      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                      status: ReasonPhrases.INTERNAL_SERVER_ERROR,
                    });
                  });
              }
            });
          } else {
            const isPasswordValid = await bcrypt.compare(
              req.body.password,
              user.hash_password
            );
            if (!isPasswordValid) {
              res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Password is invalid!",
                statusCode: StatusCodes.UNAUTHORIZED,
                status: ReasonPhrases.UNAUTHORIZED,
              });
            } else {
              const {
                firstName,
                lastName,
                username,
                email,
                address,
                isVerified,
                profilePicture,
                contactNumber,
                phoneNumber,
                dateOfBirth,
              } = user;
  
              const accessToken = jwt.sign(
                {
                  user_id: user.id,
                  role: user.role,
                  email: user.email,
                  username: user.username,
                },
                jwtSecret,
                {
                  expiresIn: "1d",
                }
              );
  
              // Generate a refresh token (for extended sessions)
  
              const refreshToken = jwt.sign(
                { username: user.username, userId: user.id },
                refressSecret,
                {
                  expiresIn: "7d",
                }
              );
  
              const id_token = jwt.sign(
                {
                  firstName,
                  lastName,
                  username,
                  email,
                  address,
                  isVerified,
                  profilePicture,
                  contactNumber,
                  phoneNumber,
                  dateOfBirth,
                },
                refressSecret,
  
                {
                  expiresIn: "30d",
                }
              );
              res.cookie("accessToken", accessToken, {
                path: "/",
                httpOnly: true,
              });
              res.cookie("refreshToken", refreshToken, {
                path: "/",
                httpOnly: true,
              });
              res.cookie("idToken", id_token, { path: "/", httpOnly: true });
  
              res.status(StatusCodes.OK).json({
                access_token: accessToken,
                token_type: "Bearer",
                id_token,
                refresh_token: refreshToken,
                expires_in: 9000000, // 15 minutes in seconds
                statusCode: StatusCodes.OK,
                status: ReasonPhrases.OK,
              });
            }
          }
        }
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    }
  };
  
  const reset = async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
  
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
      });
  
      if (!user) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "Invalid or expired token",
          statusCode: StatusCodes.BAD_REQUEST,
          status: ReasonPhrases.BAD_REQUEST,
        });
      } else {
        let mailBody = {
          body: {
            name: user.fullName,
            intro: "Your password has been successfully reset.",
            action: {
              instructions: `You can now log in to your account with your new password.`,
              button: {
                color: "#22BC66", // Optional action button color
                text: "Login Now",
                link: `${host}/${loginPath}`,
              },
            },
            outro:
              "If you did not request this, please ignore this email and your password will remain unchanged.",
          },
        };
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds
        user.hash_password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
  
        await user.save();
  
        transporter
          .sendMail(
            createMailOptions(
              "salted",
              user.email,
              `Password reset successfully`,
              mailBody
            )
          )
          .then(() => {
            res.status(StatusCodes.OK).json({
              message: "Password reset successfully",
              statusCode: StatusCodes.OK,
              status: ReasonPhrases.OK,
            });
          })
          .catch((error) => {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
              message: error.message,
              statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
              status: ReasonPhrases.INTERNAL_SERVER_ERROR,
            });
          });
      }
  
      // Password reset successful
      // return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      // Handle error
  
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    }
  };
  
  const logout = async (req, res) => {
    try {
      const sessionId = req?.headers?.session_id;
      req.session.destroy((err) => {
        if (err) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: err.message,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            status: ReasonPhrases.INTERNAL_SERVER_ERROR,
          });
        } else {
          // Successfully destroyed the session, now remove it from the database
  
          res.status(StatusCodes.OK).json({
            message: "Logout Success",
            statusCode: StatusCodes.OK,
            status: ReasonPhrases.OK,
          });
        }
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    }
  };
  
  const verify = async (req, res) => {
    try {
      const token = req.headers.authorization;
  
      if (!token || !token.startsWith("Bearer ")) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Token Not Provided",
          statusCode: StatusCodes.UNAUTHORIZED,
          status: ReasonPhrases.UNAUTHORIZED,
        });
      } else {
        const tokenValue = token.split(" ")[1];
        const decodeduser = jwt.verify(tokenValue, jwtSecret);
        if (!decodeduser) {
          res.status(StatusCodes.FORBIDDEN).json({
            message: "Authorization Token is Not Valid",
            statusCode: StatusCodes.FORBIDDEN,
            status: ReasonPhrases.FORBIDDEN,
          });
        } else {
          await User.findOne({ _id: decodeduser.user_id }).then((data, err) => {
            if (err) {
              res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Not Authorised",
                statusCode: StatusCodes.UNAUTHORIZED,
                status: ReasonPhrases.UNAUTHORIZED,
              });
            } else {
              const {
                firstName,
                lastName,
                username,
                email,
                address,
                isVerified,
                profilePicture,
                phoneNumber,
                dateOfBirth,
                contactNumber,
              } = data;
              const accessToken = jwt.sign(
                {
                  user_id: data.id,
                  role: data.role,
                  email: data.email,
                  username: data.username,
                },
                jwtSecret,
                {
                  expiresIn: "1d",
                }
              );
              const id_token = jwt.sign(
                {
                  firstName,
                  lastName,
                  username,
                  email,
                  address,
                  isVerified,
                  profilePicture,
                  contactNumber,
                  phoneNumber,
                  dateOfBirth,
                },
                refressSecret,
  
                {
                  expiresIn: "30d",
                }
              );
              res.cookie("accessToken", accessToken, {
                path: "/",
                httpOnly: true,
              });
              res.cookie("idToken", id_token, { path: "/", httpOnly: true });
  
              res.status(StatusCodes.OK).json({
                accessToken,
                id_token,
                message: "Authorized",
                statusCode: StatusCodes.OK,
                status: ReasonPhrases.OK,
              });
            }
          });
        }
      }
  
      // Proceed with the protected route logic
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    }
  };
  
  const forget = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({
        email,
      });
      if (!user) {
        res.status(StatusCodes.NOT_FOUND).json({
          message: "Email address is not registered",
          statusCode: StatusCodes.NOT_FOUND,
          status: ReasonPhrases.NOT_FOUND,
        });
      } else {
        const resetToken = jwt.sign(
          {
            user_id: user.id,
            role: user.role,
            email: user.email,
          },
          jwtSecret,
          {
            expiresIn: "1h",
          }
        );
        const resetTokenExpiration = Date.now() + 3600000; // 1 hour
  
        const data = await User.updateOne(
          { email: req.body.email },
          {
            resetToken,
            resetTokenExpiration,
          }
        );
        if (!data) {
          res.status(StatusCodes.BAD_REQUEST).json({
            message: "Reset password email generation failed",
            statusCode: StatusCodes.BAD_REQUEST,
            status: ReasonPhrases.BAD_REQUEST,
          });
        } else {
          let mailBody = {
            body: {
              name: user.fullName,
              intro:
                "You are receiving this because you (or someone else) have requested a password reset for your account.",
              action: {
                instructions: `Click on the following link to reset your password:`,
                button: {
                  color: "#22BC66", // Optional action button color
                  text: "Reset Password",
                  link: `${host}/${resetPath}?token=${resetToken}`,
                },
              },
              outro:
                "If you did not request this, please ignore this email and your password will remain unchanged.",
            },
          };
  
          transporter
            .sendMail(
              createMailOptions(
                "salted",
                user.email,
                `Password reset request`,
                mailBody
              )
            )
            .then(() => {
              res.status(StatusCodes.OK).json({
                message:
                  "Password reset email has been sent successfully. Please check your mailbox",
                statusCode: StatusCodes.OK,
                status: ReasonPhrases.OK,
              });
            })
            .catch((error) => {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                status: ReasonPhrases.INTERNAL_SERVER_ERROR,
              });
            });
        }
      }
    } catch (error) {
      // Handle error
  
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    }
  };
  
  const confirm = async (req, res) => {
    try {
      const { token } = req.params;
  
      const decodeduser = jwt.verify(token, jwtSecret);
      if (!decodeduser) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "Invalid or expired token",
          statusCode: StatusCodes.BAD_REQUEST,
          status: ReasonPhrases.BAD_REQUEST,
        });
      } else {
        const user = await User.findOne({
          email: decodeduser.email,
        });
        if (!user) {
          res.status(StatusCodes.BAD_REQUEST).json({
            message: "Invalid user Token",
            statusCode: StatusCodes.BAD_REQUEST,
            status: ReasonPhrases.BAD_REQUEST,
          });
        } else if (user.isVerified) {
          res.status(StatusCodes.OK).json({
            message: "Accoount is Already Verified",
            statusCode: StatusCodes.OK,
            status: ReasonPhrases.OK,
          });
        } else {
          user.isEmailconfirm = true;
          user.isVerified = true;
          user.confirmToken = "";
          await user.save();
          res.status(StatusCodes.OK).json({
            message: "Accoount Confirm successfully",
            statusCode: StatusCodes.OK,
            status: ReasonPhrases.OK,
          });
        }
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    }
  };
  
  const changes = async (req, res) => {
    try {
      const { password, updated_user_id } = req.body;
  
      const user = await User.findOne({
        _id: updated_user_id,
      });
  
      if (!user) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "Invalid or expired token",
          statusCode: StatusCodes.BAD_REQUEST,
          status: ReasonPhrases.BAD_REQUEST,
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds
        user.hash_password = hashedPassword;
        await user.save();
        res.status(StatusCodes.OK).json({
          message: "Password Changed successfully",
          statusCode: StatusCodes.OK,
          status: ReasonPhrases.OK,
        });
      }
  
      // Password reset successful
      // return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      // Handle error
  
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    }
  };
  
  const profile = async (req, res) => {
    const { user } = req.params;
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "user id is not provide",
        statusCode: StatusCodes.BAD_REQUEST,
        status: ReasonPhrases.BAD_REQUEST,
      });
    } else {
      try {
        const userId = await User.findOne({ _id: user }).select([
          "firstName",
          "lastName",
          "username",
          "email",
          "updatedAt",
          "contactNumber",
          "profilePicture",
          "phoneNumber",
          "dateOfBirth",
        ]);
  
        if (userId.id) {
          return res.status(StatusCodes.OK).json({
            message: `Userdata data Loaded Successfully!`,
            statusCode: StatusCodes.OK,
            status: ReasonPhrases.OK,
            result: userId,
          });
        } else {
          return res.status(StatusCodes.NOT_FOUND).json({
            message: `No information found for given id`,
            statusCode: StatusCodes.NOT_FOUND,
            status: ReasonPhrases.NOT_FOUND,
          });
        }
      } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: error.message,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          status: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
      }
    }
  };
  
  const refresh = async (req, res) => {
    try {
      const token = req.headers.authorization;
  
      if (!token || !token.startsWith("Bearer ")) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Token Not Provided",
          statusCode: StatusCodes.UNAUTHORIZED,
          status: ReasonPhrases.UNAUTHORIZED,
        });
      } else {
        const tokenValue = token.split(" ")[1];
        const decodeduser = jwt.verify(tokenValue, jwtSecret);
  
        if (!decodeduser) {
          res.status(StatusCodes.FORBIDDEN).json({
            message: "Authorization Token is Not Valid",
            statusCode: StatusCodes.FORBIDDEN,
            status: ReasonPhrases.FORBIDDEN,
          });
        } else {
          await User.findOne(
            { _id: decodeduser.user_id },
            "_id role firstName lastName username email profilePicture contactNumber "
          ).then(async (data, err) => {
            if (err) {
              res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Not Authorized",
                statusCode: StatusCodes.UNAUTHORIZED,
                status: ReasonPhrases.UNAUTHORIZED,
              });
            } else {
              const decoderefresh = jwt.verify(req.body.token, refressSecret);
              if (!decoderefresh) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                  message: "Refresh Token is not valid",
                  statusCode: StatusCodes.UNAUTHORIZED,
                  status: ReasonPhrases.UNAUTHORIZED,
                });
              } else {
                await User.findOne(
                  { _id: decoderefresh.userId },
                  "_id role firstName lastName username email profilePicture contactNumber "
                ).then((newData, err) => {
                  if (err) {
                    res.status(StatusCodes.UNAUTHORIZED).json({
                      message: "Not Authorized",
                      statusCode: StatusCodes.UNAUTHORIZED,
                      status: ReasonPhrases.UNAUTHORIZED,
                    });
                  } else {
                    const accessToken = jwt.sign(
                      {
                        user_id: newData.id,
                        role: newData.role,
                        email: newData.email,
                        username: newData.username,
                      },
                      jwtSecret,
                      {
                        expiresIn: "1d",
                      }
                    );
                    res.cookie("accessToken", accessToken, {
                      path: "/",
                      httpOnly: true,
                    });
  
                    res.status(StatusCodes.OK).json({
                      accessToken,
                      message: "Authorized",
                      statusCode: StatusCodes.OK,
                      status: ReasonPhrases.OK,
                    });
                  }
                });
              }
            }
          });
        }
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    }
  };
  const update = async (req, res) => {
    const { user } = req.params;
    try {
      if (!user) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "user id is not provide",
          statusCode: StatusCodes.BAD_REQUEST,
          status: ReasonPhrases.BAD_REQUEST,
        });
      }
  
      const userdata = await User.findById(user);
      if (userdata) {
        try {
          // const result = await User.findOneAndUpdate(
          //   {_id: user},
          //   { $set: req.body },
          //   { returnOriginal: false }
          // );
  
          // // const body = { ...req.body };
          User.findOneAndUpdate({_id: user}, { $set: req.body }, { upsert: true },{ returnOriginal: false }).then(
            (data, err) => {
              if (err)
                res.status(StatusCodes.NOT_MODIFIED).json({
                  message: err.message,
                  status: ReasonPhrases.NOT_MODIFIED,
                  statusCode: StatusCodes.NOT_MODIFIED,
                });
              else {
  
                const {id} =data
                res.status(StatusCodes.OK).json({
                  message: "Profile is  Update Successfully",
                  status: ReasonPhrases.OK,
                  statusCode: StatusCodes.OK,
                });
              }
            }
          );
        } catch (error) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            status: ReasonPhrases.INTERNAL_SERVER_ERROR,
          });
        }
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "User does not exist..!",
          statusCode: StatusCodes.BAD_REQUEST,
          status: ReasonPhrases.BAD_REQUEST,
        });
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    }
  };
  
  module.exports = {
    register,
    login,
    logout,
    refresh,
    verify,
    confirm,
    reset,
    forget,
    changes,
    profile,
    update,
  };
  