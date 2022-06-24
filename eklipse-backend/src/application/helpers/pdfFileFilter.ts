import { BadRequestException } from '@nestjs/common';

export const pdfFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(pdf|PDF)$/)) {
    return callback(
      new BadRequestException('Solo se Permiten archivos en Formato PDF!'),
      false
    );
  }
  callback(null, true);
};
