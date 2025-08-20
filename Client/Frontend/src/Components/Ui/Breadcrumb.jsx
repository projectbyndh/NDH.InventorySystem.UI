import React from "react";
import { ChevronRight } from "lucide-react"; // optional if you use lucide-react for icons

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1">
        {items.map((item, idx) => (
          <li key={idx} className="inline-flex items-center">
            {idx > 0 && <ChevronRight className="mx-1 w-4 h-4 text-gray-400" />}
            {item.href ? (
              <a
                href={item.href}
                className="text-blue-600 hover:underline font-medium"
              >
                {item.label}
              </a>
            ) : (
              <span className="text-gray-500">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
