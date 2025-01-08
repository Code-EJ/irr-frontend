// import React from "react";
// import { Formik, Form } from "formik";
// import InputCheckbox from "./InputCheckbox";

// const InputCheckbox = () => {
//   const validate = (values) => {
//     const errors = {};
//     if (!values.relatorioFeito) {
//       errors.relatorioFeito = 'Você precisa marcar que o relatório foi feito';
//     }
//     return errors;
//   };

//   return (
//     <Formik
//       initialValues={{
//         relatorioFeito: false, 
//       }}
//       validate={validate} 
//       onSubmit={(values) => {
//         console.log("Formulário enviado com os seguintes dados:", values);
//       }}
//     >
//       {({ isSubmitting, errors, touched }) => (
//         <Form>
//           <InputCheckbox
//             id="relatorioFeito"
//             name="relatorioFeito"
//             titulo="Relatório do mês já ocorreu."
//           />
//           {errors.relatorioFeito && touched.relatorioFeito && (
//             <div className="text-red-500 text-xs">{errors.relatorioFeito}</div>
//           )}
//           <button type="submit" disabled={isSubmitting}>
//             Enviar
//           </button>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default InputCheckbox;
