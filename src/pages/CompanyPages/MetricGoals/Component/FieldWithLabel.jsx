import React from 'react'


const FormWithLabel = ({fieldId, label, placeholderText, fieldType}) => {
  return (
    <>
      <div className="col-md-6 mb-4">
          <label htmlFor={fieldId} className="form-label">{label}</label>
          <input type={fieldType} className="form-control" id={fieldId} placeholder={placeholderText} />
      </div>
    </>
  )
}

export default FormWithLabel
