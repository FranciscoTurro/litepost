import { DoubleArrowUp } from '../assets/svg/DoubleArrowUp';

export const ScrollTop = () => {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-0 left-0 z-50 m-7 rounded-full p-4 bg-custom_gray-5 hover:bg-custom_gray-4"
    >
      <DoubleArrowUp />
    </button>
  );
};
