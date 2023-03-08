import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { SubmitButton } from '../components/SubmitButton';
import { useRegisterMutation } from '../generated/generated-types';
import { UserInput as User } from '../generated/generated-types';

const Register = () => {
  const router = useRouter();

  const [register, { loading, client }] = useRegisterMutation();

  const [user, setUser] = useState<User>({ username: '', password: '' });
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await register({
      variables: { username: user.username, password: user.password },
    });
    if (response.data?.registerUser.error) {
      if (response.data.registerUser.error.field === 'username')
        setUsernameError(response.data.registerUser.error.message);
      if (response.data.registerUser.error.field === 'password')
        setPasswordError(response.data.registerUser.error.message);
    } else if (response.data?.registerUser.user) {
      client.resetStore();
      router.push('/');
    }
  };

  return (
    <div className="max-w-3xl w-full mt-8 mx-auto flex flex-col items-center">
      <form onSubmit={handleSubmit} autoComplete="off" className="w-3/4">
        <h1 className="mb-4 text-2xl font-extrabold leading-none mdl:text-3xl lg:text-4xl">
          Register
        </h1>
        <div className="mb-5">
          <div>
            <input
              placeholder="username"
              onChange={(e) => {
                setUsernameError('');
                setUser({ ...user, username: e.target.value });
              }}
              value={user.username}
              className={`h-12 border-2 outline-none border-custom_gray-6 text-sm rounded-lg focus:border-bright_crimson-1 block w-full p-2.5
 ${usernameError ? 'bg-bright_crimson-1' : 'bg-custom_gray-5 '}`}
            />
            {usernameError ? (
              <p className="pl-2 text-bright_crimson-1">{usernameError}</p>
            ) : null}
          </div>
        </div>
        <div className="mb-5">
          <div>
            <input
              placeholder="password"
              onChange={(e) => {
                setPasswordError('');
                setUser({ ...user, password: e.target.value });
              }}
              value={user.password}
              type="password"
              id="password"
              className={`h-12 border-2 outline-none border-custom_gray-6 text-sm rounded-lg focus:border-bright_crimson-1 block w-full p-2.5
 ${passwordError ? 'bg-bright_crimson-1' : 'bg-custom_gray-5'}`}
            />
            {passwordError ? (
              <p className="pl-2 text-bright_crimson-1">{passwordError}</p>
            ) : null}
          </div>
        </div>
        <SubmitButton name="Register" loading={loading} />
      </form>
    </div>
  );
};

export default Register;
