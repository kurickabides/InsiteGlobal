import { ProtosTemplate } from "../../core/types";


import { SkylynxDataModel } from "../../core/types";

export interface DyFormRendererProps {
  dyFormTemplate: ProtosTemplate;
  viewModel: ProtosTemplate;
  dataModel: ProtosTemplate;
}

//Not switch Out for correct stuff later maybe 
//Not Sure I like this approch this is just schofold for geeting to home plate
export interface DyFormModalDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  dyFormTemplate: ProtosTemplate;
  viewModel: ProtosTemplate;
  dataModel: ProtosTemplate;
}
