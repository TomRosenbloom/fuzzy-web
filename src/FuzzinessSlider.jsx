import { useState } from "react";

export default function FuzzinessSlider({value, onChange}) {

  return (
    <input
      type="range"
      min="0"
      max="60"
      step="5"
      value={value}
      onChange={onChange}
    />
  )

}
