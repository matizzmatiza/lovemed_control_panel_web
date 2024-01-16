import { useState, useEffect } from "react";

function Alert({ message, onClose, show }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timeout = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [onClose, show]);

  return (
    visible && (
      <div className="App-alert">
        <p className="alert-content">⚠️&nbsp;&nbsp;{message}</p>
      </div>
    )
  );
}

export default Alert;
