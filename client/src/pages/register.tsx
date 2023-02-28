import { FormEvent, useState } from 'react';

interface IUser {
  username: string;
  password: string;
}

const Register = () => {
  const [user, setUser] = useState<IUser>({ username: '', password: '' });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(user);
  };

  return (
    <div className="max-w-3xl w-full mt-8 mx-auto flex flex-col items-center">
      <form onSubmit={handleSubmit} autoComplete="off" className="w-3/4">
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
        <button
          type="submit"
          className="w-24 bg-atomic_teal-1 hover:bg-atomic_teal-2  text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
