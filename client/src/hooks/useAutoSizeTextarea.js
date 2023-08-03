import React from "react";

export const useAutoSizeTextarea = (textareaRef, value) => {
  React.useEffect(() => {
    if (textareaRef) {
      textareaRef.style.height = "28px";
      textareaRef.style.height = textareaRef.scrollHeight + "px";
    }
  }, [textareaRef, value]);
};
