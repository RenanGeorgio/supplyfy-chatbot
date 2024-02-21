import { mergeTypeDefs } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import path from "path";

const mergePath = loadFilesSync(
  path.join(__dirname, "modules/**/requisition/*.gql")
);

const schemas = mergeTypeDefs(mergePath);

export default schemas;