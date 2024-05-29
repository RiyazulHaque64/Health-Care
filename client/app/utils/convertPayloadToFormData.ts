const convertPayloadToFormData = (values: any) => {
  const { icon, ...data } = values;
  const stringifiedVlaues = JSON.stringify(data);
  const formData = new FormData();
  formData.append("data", stringifiedVlaues);
  if (icon) {
    formData.append("file", icon);
  }
  return formData;
};

export default convertPayloadToFormData;
