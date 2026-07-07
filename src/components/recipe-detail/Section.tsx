import React, { FC } from 'react';

type Props = {
  label: string;
  children: React.ReactNode;
};

const Section: FC<Props> = ({ label, children }) => {
  return (
    <div className="tw:mb-6">
      <h2 className="tw:text-xs tw:font-semibold tw:text-[#c4b5fd] tw:uppercase tw:tracking-wide tw:mb-2">
        {label}
      </h2>
      {children}
    </div>
  );
};

export default Section;
