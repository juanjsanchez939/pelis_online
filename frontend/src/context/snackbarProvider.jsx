import { useState, useCallback } from "react";
import { SnackbarContext } from "./snackbarContext";

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "info",
  });

  const showSnackbar = useCallback((message, type = "info") => {
    setSnackbar({ open: true, message, type });

    setTimeout(() => {
      setSnackbar({ open: false, message: "", type: "info" });
    }, 2500);
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      {snackbar.open && (
        <div className={`snackbar ${snackbar.type}`}>
          {snackbar.message}
        </div>
      )}
    </SnackbarContext.Provider>
  );
};
