// import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
// import { InternalServerError } from "../utils/appError.utils.js";

// let pgCheckpointer: PostgresSaver;

// export const getPostgresCheckpointer = async () => {
//   if (!pgCheckpointer) {
//     try {
//       pgCheckpointer = PostgresSaver.fromConnString(process.env.DATABASE_URL!);
//       await pgCheckpointer.setup();
//     } catch {
//       throw new InternalServerError("Error occured while connecting to Postgres");
//     }
//   }
//   return pgCheckpointer;
// };

// export default await getPostgresCheckpointer();
