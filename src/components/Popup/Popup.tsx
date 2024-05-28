import { ReactElement } from 'react';

const Popup = ({
  xPos,
  yPos,
  children,
}: {
  xPos: number;
  yPos: number;
  children: ReactElement;
}) => {
  return (
    <div
      id="popup"
      className="z-10 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      style={{
        position: 'absolute',
        top: yPos,
        left: xPos,
        marginTop: '20px',
      }}
    >
      <ul>{children}</ul>
    </div>
  );
};

export default Popup;
