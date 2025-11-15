// DevToastTester removed: production builds should not include developer toast controls.
// This module intentionally exports a no-op React component so any leftover imports
// won't render UI. The development tester was purposefully removed.
import React from "react";

export default function DevToastTester() {
  return null;
}
