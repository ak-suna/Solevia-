import React from "react";

const requirements = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "At least one uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "At least one lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "At least one number", test: (pw) => /[0-9]/.test(pw) },
  { label: "At least one special character", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

export function checkPasswordStrength(password) {
  return requirements.map((req) => req.test(password));
}

const PasswordStrength = ({ password }) => {
  const results = checkPasswordStrength(password);
  return (
    <div className="space-y-1 mt-2">
      {requirements.map((req, i) => (
        <div key={req.label} className="flex items-center gap-2 text-sm">
          {results[i] ? (
            <span className="text-green-500">✔</span>
          ) : (
            <span className="text-red-400">✖</span>
          )}
          <span className={results[i] ? "text-green-600" : "text-red-500"}>{req.label}</span>
        </div>
      ))}
    </div>
  );
};

export default PasswordStrength;
