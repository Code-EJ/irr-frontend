/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Card from "../../components/Card";
import Button from "../../components/Button";
import SimpleForm from "../../components/SimpleForm";
import InputText from "../../components/InputText";
import { fleet } from "./api";
import { errorMessage } from "../../shared/api/transport";
export default function VehicleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({ licensePlate: "", model: "" });
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    if (id) {
      setLoading(true);
      void fleet
        .get(id)
        .then((data) => {
          if (active)
            setValues({
              licensePlate: data.licensePlate ?? "",
              model: data.model ?? "",
            });
        })
        .catch((err) => {
          if (active) setError(errorMessage(err));
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }
    return () => {
      active = false;
    };
  }, [id]);
  return (
    <Card className="rounded-3xl shadow max-w-xl mx-auto w-full">
      <Link className="underline" to="/vehicle-list">
        Back to vehicles
      </Link>
      <h1 className="text-2xl font-bold mt-4">
        {id ? "Edit vehicle" : "Add vehicle"}
      </h1>
      {loading ? (
        <p role="status">Loading vehicle…</p>
      ) : (
        <SimpleForm
          enableReinitialize
          initialValues={values}
          onSubmit={async (input) => {
            setError("");
            try {
              if (id) await fleet.update(id, { ...input, isActive: true });
              else await fleet.create(input);
              navigate("/vehicle-list");
            } catch (err) {
              setError(errorMessage(err));
            }
          }}
        >
          {(formik) => (
            <>
              <InputText
                name="licensePlate"
                titulo="License plate"
                required
                maxLength={20}
              />
              <InputText name="model" titulo="Model" required maxLength={100} />
              <Button
                titulo="Save vehicle"
                type="submit"
                disabled={formik.isSubmitting || (!!id && !values.licensePlate)}
              />
            </>
          )}
        </SimpleForm>
      )}
      {error && (
        <p role="alert" className="text-red-800 my-4">
          {error}
        </p>
      )}
    </Card>
  );
}
