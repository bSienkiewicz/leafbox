import React from "react";

const RecoveryBox = ({recovery}) => {
  return (
    <div className="w-[400px] max-w-full mb-4">
      <h1 className="text-2xl font-medium mb-4">All things done!</h1>
      <p>Make sure to copy this recovery code and store it in a safe place.</p>

      <p className="text-gray-300 text-sm mb-3">
        {" "}
        You'll need it to recover your password if you ever forget it.
      </p>
      <div className="relative">
        <input
          className="w-full rounded py-2 px-4 mb-3 text-sm bg-gray-700/20"
          readOnly
          value={recovery}
        />
        <button
          className="absolute right-0 top-0 bottom-0 px-4"
          onClick={() => navigator.clipboard.writeText(recovery)}
        >
          <span className="sr-only">Copy recovery code</span>
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M14 2H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2zM6 4h8v10H6V4z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <button
        type="submit"
        className="w-full bg-black hover:bg-neutral-900 text-white rounded-full py-4 text-sm mt-4"
        onClick={() => setStep(1)}
      >
        Login
      </button>
    </div>
  );
};

export default RecoveryBox;
