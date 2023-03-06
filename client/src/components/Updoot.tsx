import { ArrowDown } from '../assets/svg/ArrowDown';
import { ArrowUp } from '../assets/svg/ArrowUp';

interface UpdootProps {
  points: number;
}

//make this take in the info necessary for voting, and handle the mutation here

export const Updoot: React.FC<UpdootProps> = ({ points }) => {
  return (
    <div className="h-full flex flex-col justify-between w-6">
      <ArrowUp />
      <p className="text-center">{points}</p>
      <ArrowDown />
    </div>
  );
};
