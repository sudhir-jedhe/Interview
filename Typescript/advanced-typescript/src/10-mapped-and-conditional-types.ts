// mapped types - create a new type by looping over the keys of another type

import { boolean } from "zod";

type User = {
  id: number;
  name: string;
  email: string;
};

type UserPermissions = {
  [key in keyof User]: boolean;
};

// UserPermissions
//  {
//     id: boolean;
//     name: boolean;
//     email: boolean
//  }

const editFeature: UserPermissions = {
  id: false,
  name: true,
  email: true,
};

type User1 = {
  id: number;
  name: string;
  email: string;
};

// conditional type - create type based on certain condition

type ValueCategory<T> = T extends string ? "text" : "other";

type NameCategory = ValueCategory<string>;
type AgeCategory = ValueCategory<number>;

const nameCategory: NameCategory = "text";
const agecategory: AgeCategory = "other";
