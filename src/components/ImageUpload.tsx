// ImageUpload.tsx
import { useField, useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import MyLazyLoadedImage from '@/components/MyLazyLoadedImage';

interface ImageUploadProps {
  name: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ name }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField({ name });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFieldValue(name, acceptedFiles[0]);
    },
    [name, setFieldValue]
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
