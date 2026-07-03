import { prisma } from "./db";

export function add_output_to_DB(finalOutput: string, submissionId: string, success: boolean) {
  return new Promise<void>(async (resolve, reject) => {
    try {
          console.log(`Updating submission:- ${submissionId}`);
          await prisma.submission.update({
            where: {
              id: submissionId,
            },
            data: {
              status: success ? "success" : "failure",
              output: finalOutput,
            },
          });
          resolve();
    } catch (e) {
      reject(`ERROR WHILE INSERTING OUTPUT IN DATABASE:- ${e}`);
    }
  });
}
