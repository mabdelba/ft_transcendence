import { HttpException, HttpStatus } from '@nestjs/common';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'Only image files are allowed!',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      ),
      false,
    );
  }
  callback(null, true);
};
