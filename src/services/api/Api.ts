import AuthService from "./services/AuthService";
import CollectionService from "./services/CollectionService";
import DonationService from "./services/DonationService";
import DonatorService from "./services/DonatorService";
import DriverService from "./services/DriverService";
import InputMaterialService from "./services/InputMaterialService";
import OutputMaterialService from "./services/OutputMaterialService";
import PressingService from "./services/PressingService";
import SaleService from "./services/SaleService";
import SubTypologyService from "./services/SubTypologyService";
import TriageService from "./services/TriageService";
import TypologyService from "./services/TypologyService";
import UserService from "./services/UserService";
import VehicleService from "./services/VehicleService";

const api = {
  auth: AuthService,
  user: UserService,
  driver: DriverService,
  vehicle: VehicleService,
  collection: CollectionService,
  donator: DonatorService,
  donation: DonationService,
  typology: TypologyService,
  subTypology: SubTypologyService,
  triage: TriageService,
  pressing: PressingService,
  inputMaterial: InputMaterialService,
  outputMaterial: OutputMaterialService,
  sale: SaleService
}

export default api;