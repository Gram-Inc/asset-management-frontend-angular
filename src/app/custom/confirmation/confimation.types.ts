export interface RikielConfirmationConfig {
  title?: string;
  message?: string;
  icon?: {
    show?: boolean;
    name?: string;
    color?: "basic" | "info" | "success" | "warning" | "error";
  };
  actions?: {
    confirm?: {
      show?: boolean;
      label?: string;
      color?: "primary" | "accent" | "warn";
    };
    cancel?: {
      show?: boolean;
      label?: string;
    };
  };
  dismissible?: boolean;
}
