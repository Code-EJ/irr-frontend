import { Formik, Form } from "formik";

const SimpleForm = ({ initialValues, onSubmit, children }) => (
  <Formik initialValues={initialValues} onSubmit={onSubmit}>
    {(formik) => <Form>{children}</Form>}
  </Formik>
);

export default SimpleForm;
