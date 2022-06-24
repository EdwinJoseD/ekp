import { extname } from 'path';

export const editFileName = (req, file, callback) => {
  const name = new Date().getTime();
  const fileName = `${name}${extname(file.originalname)}`;
  callback(null, fileName);
};
