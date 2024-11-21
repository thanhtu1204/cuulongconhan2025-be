// components/CKEditorField.tsx
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useField } from 'formik';
import React from 'react';

interface CKEditorFieldProps {
  label: string;
  name: string;
}

const CKEditorField: React.FC<CKEditorFieldProps> = ({ label, name }) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = (_event: any, editor: any) => {
    const data = editor.getData();
    helpers.setValue(data).then(() => {});
  };

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <CKEditor editor={ClassicEditor} data={field.value} onChange={handleChange} />
      {meta.touched && meta.error ? <div style={{ color: 'red' }}>{meta.error}</div> : null}
    </div>
  );
};

export default CKEditorField;
