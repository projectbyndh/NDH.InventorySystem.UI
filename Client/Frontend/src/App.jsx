import React from 'react';
import './index.css'; // Ensure correct path

function App() {
  return (
    <>
      <div className="space-y-4 p-4">
        {/* Color-based text examples */}
        <p className="text-primary-base">Primary base text</p>
        <p className="text-primary-subtle">Primary subtle text</p>
        <p className="text-error-base">Error base text</p>
        <p className="text-success-base">Success text</p>
        <p className="text-disabled">Disabled text</p>

        {/* Typography examples */}
        <h1 className="text-h1-regular">H1 Regular</h1>
        <h1 className="text-h1-bold">H1 Bold</h1>
        <h2 className="text-h2-semibold">H2 Semi Bold</h2>
        <h3 className="text-h3-medium">H3 Medium</h3>
        <h4 className="text-h4-bold">H4 Bold</h4>
        <h5 className="text-h5-regular">H5 Regular</h5>
        <p className="text-body-xlarge-bold">Body XLarge Bold</p>
        <p className="text-body-large-semibold">Body Large Semi Bold</p>
        <p className="text-body-medium-medium">Body Medium Medium</p>
        <p className="text-body-small-regular">Body Small Regular</p>
        <p className="text-body-xsmall-bold">Body XSmall Bold</p>

        {/* Spacing examples */}
        <div className="m-200 p-300 bg-primary-100 rounded-md border-md opacity-half">
        </div>
        <div className="m-400 p-100 rounded-xs border-sm opacity-low">
        </div>
        <div className="m-600 p-800 rounded-circle border-lg opacity-semi">
        </div>
      </div>
    </>
  );
}

export default App;