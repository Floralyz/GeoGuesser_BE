import * as fs from 'fs';
import { diskStorage, Options } from 'multer';
import { extname } from 'path';

type validFileExtensionsType = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions: validFileExtensionsType[] = ['png', 'jpg', 'jpeg'];
const validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];

export const saveImageToStorage: Options = {
  storage: diskStorage({
    destination: './files',
    filename(req, file, callback) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

      const ext = extname(file.originalname);

      const filename = `${uniqueSuffix}${ext}`;
      console.log('ali dela')
      callback(null, filename);
    },
  }),
  fileFilter(req, file, callback) {
    const ext = extname(file.originalname).toLowerCase();
    const isValidExtension = validFileExtensions.includes(ext.substr(1) as validFileExtensionsType);
    const isValidMimeType = validMimeTypes.includes(file.mimetype as validMimeType);

    if (isValidExtension && isValidMimeType) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
};

export const isFileExtensionSafe = (filename: string): boolean => {
  const ext = extname(filename).toLowerCase();
  return validFileExtensions.includes(ext.substr(1) as validFileExtensionsType);
};

export const removeFile = (fullFilePath: string): void => {
  try {
    fs.unlinkSync(fullFilePath);
  } catch (error) {
    console.log(error);
  }
};
