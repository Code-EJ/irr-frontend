/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import {
  Formik,
  Form,
  type FormikConfig,
  type FormikValues,
  type FormikProps,
} from "formik";
type Props<V extends FormikValues> = Omit<FormikConfig<V>, "children"> & {
  children: (formik: FormikProps<V>) => React.ReactNode;
  autoSetErrors?: boolean;
  submitOnChange?: boolean;
};
export default function SimpleForm<V extends FormikValues>({
  children,
  autoSetErrors: _autoSetErrors,
  submitOnChange: _submitOnChange,
  ...config
}: Props<V>) {
  return (
    <Formik {...config}>{(formik) => <Form>{children(formik)}</Form>}</Formik>
  );
}
