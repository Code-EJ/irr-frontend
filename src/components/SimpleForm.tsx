
import { Formik, Form } from "formik";
import { get } from "../utils/LodashAlternatives";

const SimpleForm = ({
  children,
  initialValues,
  onSubmit,
  autoSetErrors,
  submitOnChange,
  ...rest
}) => (
  <Formik
    initialValues={initialValues}
    {...rest}
    onSubmit={async (values, { setFieldError, setSubmitting }) => {
      try {
        await onSubmit(values, { setFieldError });
      } catch (err) {
        if (autoSetErrors) {
          const status = get(err, "response.status", "-");
          const errors = get(err, "response.data", "-");
          if (status === 400) {
            Object.keys(errors).forEach((field) => {
              if (field === "non_field_errors") {
              } else {
                try {
                  setFieldError(field, errors[field]);
                } catch (e) {
                  // DO NOTHING
                }
              }
            });
          } else {
            console.log(err);
          }
        }
      }

      setSubmitting(false);
    }}
  >
    {(formik) => <Form>{children(formik)}</Form>}
  </Formik>
);

export default SimpleForm;