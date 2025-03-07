import { mergeResolvers } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";
import path from "path";

const mergePath = loadFilesSync(
  path.join(__dirname, "modules/**/requisitions/*.resolvers.ts")
);

const resolvers = mergeResolvers(mergePath);

export default resolvers;