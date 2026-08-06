import React from 'react';
import UserList from './components/UserList';
import CreateUser from './components/CreateUser';
import UpdateUser from './components/UpdateUser';
import PatchUser from './components/PatchUser';
import DeleteUser from './components/DeleteUser';
import UserOptions from './components/UserOptions';
import UserHead from './components/UserHead';

const App: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">RESTful API Demo</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <UserList />
        <CreateUser />
        <UpdateUser />
        <PatchUser />
        <DeleteUser />
        <UserOptions />
        <UserHead />
      </div>
    </div>
  );
};

export default App;

