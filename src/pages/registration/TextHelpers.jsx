import { useRef, useState, useEffect, useMemo } from "react";

const TextHelperName = () => {
  const { focused } = useFormControl() || {};

  const helperText = useMemo(() => {
    if (focused) {
      return "djcnj";
    }
    return "";
  }, [focused]);

  return <FormHelperText>{helperText}</FormHelperText>;
};

const TextHelperApellido = () => {
  const { focused } = useFormControl() || {};

  const helperText = useMemo(() => {
    if (focused) {
      return "Apellido";
    }
    return "";
  }, [focused]);

  return <FormHelperText>{helperText}</FormHelperText>;
};

export default { TextHelpers, TextHelperApellido };
