export const ApiPropIsNumeric = (description: string = "numeric (0-9)") => {
  return { type: Number, description: description };
};
export const ApiPropIsDate = (description: string = "YYYY-MM-DD") => {
  return { type: Date, description: description };
};
export const ApiPropIsString = (description: string = "any text") => {
  return { type: String, description: description };
};
export const ApiPropIsArray = (description: string = "any[]") => {
  return { type: String, description: description };
};
