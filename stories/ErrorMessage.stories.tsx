import React from "react";
import ErrorMessage from "../app/components/ErrorMessage/ErrorMessage";

export default {
  title: "ErrorMessage",
  component: ErrorMessage,
};

export const Default = () => <ErrorMessage message="Something went wrong" />;
