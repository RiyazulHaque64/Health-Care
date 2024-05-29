import { UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../error/apiError";
import mailSender from "../../helper/mailSender";
import { jwtHelpers } from "../../shared/jwtHelpers";
import prisma from "../../shared/prisma";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Email or password is invalid");
  }

  const jwtPayload = {
    userId: userData.id,
    email: userData.email,
    role: userData.role,
  };

  const accessToken = jwtHelpers.generateToken(
    jwtPayload,
    config.jwt_access_secret as Secret,
    config.jwt_access_expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    jwtPayload,
    config.jwt_refresh_secret as Secret,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const getAccessToken = async (token: string) => {
  let decoded;
  try {
    decoded = jwtHelpers.verifyToken(
      token,
      config.jwt_refresh_secret as Secret
    );
  } catch (error) {
    throw new Error("You are not authorized");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decoded.email,
      status: UserStatus.ACTIVE,
    },
  });

  const jwtPayload = {
    userId: userData.id,
    email: userData.email,
    role: userData.role,
  };

  const accessToken = jwtHelpers.generateToken(
    jwtPayload,
    config.jwt_access_secret as Secret,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const changePasswordIntoDB = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Email or password is invalid");
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return userData;
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const jwtPayload = {
    userId: userData.id,
    email: userData.email,
    role: userData.role,
  };

  const password_reset_token = jwtHelpers.generateToken(
    jwtPayload,
    config.password_reset_secret as Secret,
    config.password_reset_expires_in as string
  );

  const resetPasswordLink = `${config.client_base_url}/reset-password?id=${userData.id}&token=${password_reset_token}`;

  await mailSender(
    userData.email,
    `
      <div>
        <p>To reset your password, please click here</p>
        <a href=${resetPasswordLink}>Reset Password</a>
      </div>
    `
  );

  return resetPasswordLink;
};

const resetPasswordIntoDB = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });
  const verifyToken = jwtHelpers.verifyToken(
    token,
    config.password_reset_secret as Secret
  );
  if (!verifyToken) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");
  }
  const hashedPassword = await bcrypt.hash(payload.password, 12);
  await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: {
      password: hashedPassword,
    },
  });
  return null;
};

export const authServices = {
  loginUser,
  getAccessToken,
  changePasswordIntoDB,
  forgotPassword,
  resetPasswordIntoDB,
};
