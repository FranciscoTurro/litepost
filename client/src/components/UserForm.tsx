import { FormEvent, useState } from 'react';
import { User } from '../types';
import { SubmitButton } from './SubmitButton';

interface UserFormProps {
  handleSubmit: (e: FormEvent<HTMLFormElement>, user: User) => void;
  name: string;
  loading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  handleSubmit,
  loading,
  name,
}) => {
  const [user, setUser] = useState<User>({ username: '', password: '' });

  return (
    <div className="max-w-3xl w-full mt-8 mx-auto flex flex-col items-center">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight mdl:text-5xl lg:text-6xl">
        {name}
      </h1>
      <form
        onSubmit={(e) => handleSubmit(e, user)}
        autoComplete="off"
        className="w-3/4"
      >
        <div className="mb-6">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-900"
          >
            Username
          </label>
          <input
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            value={user.username}
            id="username"
            className="bg-gray-50 border-2 outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:border-atomic_teal-1 block w-full p-2.5"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-900"
          >
            Password
          </label>
          <input
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            value={user.password}
            type="password"
            id="password"
            className="bg-gray-50 border-2 outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:border-atomic_teal-1 block w-full p-2.5"
            required
          />
        </div>
        <SubmitButton name={name} loading={loading} />
      </form>
    </div>
  );
};
