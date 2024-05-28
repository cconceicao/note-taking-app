import './PopupItem.css';

const PopupItem = ({
  username,
  onClick,
}: {
  username: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}) => (
  <li
    data-username={username}
    onClick={onClick}
    className="popup-item py-2 px-4 divide-gray-100"
  >
    {username}
  </li>
);

export default PopupItem;
