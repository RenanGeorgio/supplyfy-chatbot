import { Consumer } from "../../../types";

export const ConsumerData = class<Consumer> {
  igsid: string | number;
  name: string | undefined;
  profilePic: any | undefined;
  constructor(user: Consumer) {
    this.igsid = user["igsid"];
    this.name = "";
    this.profilePic = "";
  }

  setProfile(name: string, profilePic: any) {
    this.name = name;
    this.profilePic = profilePic;
  }
};