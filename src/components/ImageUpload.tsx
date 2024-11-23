// ImageUpload.tsx
import { useField, useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Resizer from 'react-image-file-resizer';

import MyLazyLoadedImage from '@/components/MyLazyLoadedImage';

interface ImageUploadProps {
  name: string;
  maxWidth?: number;
  maxHeight?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ name, maxWidth = 600, maxHeight = 600 }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField({ name });

  const resizeImage = useCallback((file: File): Promise<File> => {
    return new Promise<File>((resolve, reject) => {
      Resizer.imageFileResizer(
        file,
        maxWidth, // width set to undefined to maintain aspect ratio
        maxHeight, // max height
        'JPEG',
        100,
        0,
        (uri: string | Blob) => {
          if (typeof uri === 'string') {
            fetch(uri)
              .then((res) => res.blob())
              .then((blob) => {
                const resizedFile = new File([blob], file.name, { type: file.type });
                resolve(resizedFile);
              })
              .catch((error) => reject(error));
          } else {
            reject(new Error('Failed to resize image'));
          }
        },
        'base64'
      );
    });
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: any) => {
      if (!isEmpty(acceptedFiles)) {
        const resizedFile = await resizeImage(acceptedFiles[0]);
        await setFieldValue(name, resizedFile);
      }
    },
    [name, resizeImage, setFieldValue]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop
  });

  return (
    <div>
      <div
        {...getRootProps()}
        style={{ border: '2px dashed #eeeeee', padding: '20px', cursor: 'pointer' }}
      >
        <input {...getInputProps()} accept="image/*" />
        <p>Kéo và thả một hình ảnh vào đây hoặc nhấn để chọn một ảnh.</p>
      </div>
      {field.value && typeof field.value === 'string' ? (
        <div>
          <p>Preview:</p>
          <MyLazyLoadedImage
            src={field.value}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: '200px' }}
          />
        </div>
      ) : (
        <div>
          <p>Preview:</p>
          {field.value && (
            <img
              src={URL.createObjectURL(field.value)}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: '200px' }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
