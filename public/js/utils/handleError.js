const handleErrorMessages = (errorMessages, fields) => {
  fields.forEach((field) => {
    const fieldMessage = errorMessages.find((msg) =>
      msg.toLowerCase().includes(field.name.toLowerCase())
    );

    console.log(fieldMessage);

    const fieldElement = document.getElementById(field.id);
    console.log(fieldElement);

    const fieldError = document.querySelector(field.textErrorElement);
    console.log(fieldError);

    if (fieldMessage) {
      fieldError.innerText = fieldMessage;
      fieldElement.classList.add(field.isInvalidClass);
    } else {
      fieldElement.classList.remove(field.isInvalidClass);
    }
  });
};

const handleFieldChange = (
  fieldId,
  fieldName,
  formData,
  validationSchema,
  fields
) => {
  // this function need global var isSubmit
  const fieldElement = document.getElementById(fieldId);

  fieldElement.addEventListener("input", () => {
    if (!isSubmit) return;

    console.log(isSubmit);
    // Update formData with the current value of the field
    formData[fieldName] = fieldElement.value;

    // Validate the entire form
    const { error } = validationSchema.validate(formData);

    if (error) {
      console.log(error);

      const errorMessages = error.details.map((detail) => detail.message);
      handleErrorMessages(errorMessages, fields);
      return;
    }

    console.log("no error");

    handleErrorMessages([], fields);
    return;
  });
};
