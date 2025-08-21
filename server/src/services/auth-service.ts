import { BadRequestError } from "../errors";
import { User, UserAttrs } from "../models/user";
import { AuthUtils } from "../utils/auth-utils";

export const signUpService = async (data: UserAttrs) => {
  const userExists = await User.findOne({
    email: data.email,
  });

  if (userExists) {
    throw new BadRequestError("Account already exists");
  }

  const hashedPassword = await AuthUtils.hashPassword(data.password);

  const user = User.build({ ...data, password: hashedPassword });
  await user.save();

  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };

  return {
    user: userResponse,
  };
};

export const signInService = async (data: Partial<UserAttrs>) => {
  if (!data.email || !data.password) {
    throw new BadRequestError("Missing credentials");
  }

  const user = await User.findOne({
    email: data.email,
  });

  if (!user) {
    throw new BadRequestError("Invalid credentials");
  }

  const isPasswordCorrect = await AuthUtils.comparePassword({
    password: data.password,
    candidatePassword: user.password as string,
  });

  if (!isPasswordCorrect) {
    throw new BadRequestError("Invalid credentials");
  }

  const tokenPayload = AuthUtils.createTokenPayload(user);
  const accessToken = AuthUtils.createAccessToken(tokenPayload);

  return {
    user,
    accessToken,
  };
};
