import type { Fields, Files } from 'formidable';
import formidable from 'formidable';
import type { NextApiRequest } from 'next';

export type FormidableParseReturn = {
  fields: Fields;
  files: Files;
};

export async function parseFormLargeAsync(
  req: NextApiRequest,
  formidableOptions?: formidable.Options
): Promise<FormidableParseReturn> {
  // Set the file size limit to 200MB (default is 200 * 1024 * 1024)
  const defaultFormidableOptions: formidable.Options = {
    maxFileSize: 50 * 1024 * 1024, // 200MB
    maxFieldsSize: 50 * 1024 * 1024, // 200MB
    ...formidableOptions
  };

  const form = formidable(defaultFormidableOptions);

  return new Promise<FormidableParseReturn>((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        reject(err);
      }

      resolve({ fields, files });
    });
  });
}
