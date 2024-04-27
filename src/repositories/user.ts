import { mongoErrorHandler } from "../helpers/errorHandler";
import User from "../models/user/User";

export async function userExist(userId: string) {
  try {
    const user = await User.findOne({ _id: userId });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    mongoErrorHandler(error);
  }
}
