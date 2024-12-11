import { Formik, Form } from "formik";

const SimpleForm = ({ initialValues, onSubmit, children }) => {
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {() => <Form>{children}</Form>}
    </Formik>
  );
};

export default SimpleForm;
