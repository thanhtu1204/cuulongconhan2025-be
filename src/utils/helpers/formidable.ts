import formidable from 'formidable';
import type { NextApiRequest } from 'next';

export type FormidableParseReturn = {
  fields: formidable.Fields;
  files: formidable.Files;
};

export async function parseFormAsync(
  req: NextApiRequest,
  formidableOptions?: formidable.Options
): Promise<FormidableParseReturn> {
  const form = formidable(formidableOptions);

  return new Promise<FormidableParseReturn>((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        reject(err);
      }

      resolve({ fields, files });
    });
  });
}
