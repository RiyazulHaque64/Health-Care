import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { USER_ROLE } from "../constants/role";

export type TMeta = {
  page: number;
  limit: number;
  total: number;
};

export type TUserRole = keyof typeof USER_ROLE;

export interface IDrawerItem {
  title: string;
  path: string;
  parentPath?: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string };
  child?: IDrawerItem[];
}

export type TResponseSuccess = {
  data: any;
  meta?: TMeta;
};

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: TGenericErrorMessage[];
};

export type TGenericErrorMessage = {
  path: string | number;
  message: string;
};
